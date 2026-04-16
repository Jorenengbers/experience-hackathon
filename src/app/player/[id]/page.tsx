'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneShell from '@/components/PhoneShell'
import Waveform from '@/components/Waveform'
import ScriptTranscript from '@/components/ScriptTranscript'
import { useEpisodes } from '@/lib/EpisodeContext'
import { MORNING_SCRIPT } from '@/data/script'

const SPEEDS = [0.75, 1, 1.25, 1.5]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function parseDuration(dur: string): number {
  const [m, s] = dur.split(':').map(Number)
  return m * 60 + s
}

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { episodes, updateEpisode } = useEpisodes()

  const episode = episodes.find((ep) => ep.id === id)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [showScript, setShowScript] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const isMorning = episode?.edition === 'morning'
  const accent = isMorning ? '#e8a94a' : '#7eb8f7'

  // Calculate which script line is active
  const totalLines = MORNING_SCRIPT.length
  const currentLine = duration > 0
    ? Math.min(Math.floor((currentTime / duration) * totalLines), totalLines - 1)
    : 0

  useEffect(() => {
    if (!episode?.audioFile) return

    const audio = new Audio(episode.audioFile)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setAudioAvailable(true)
      // Restore position
      if (episode.progress > 0 && episode.progress < 1) {
        audio.currentTime = audio.duration * episode.progress
        setCurrentTime(audio.currentTime)
      }
    })

    audio.addEventListener('timeupdate', () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime)
      }
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      updateEpisode(episode.id, { status: 'played', progress: 1 })
    })

    audio.addEventListener('error', () => {
      setAudioAvailable(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id, episode?.audioFile])

  // Use estimated duration from episode data if audio not loaded
  useEffect(() => {
    if (!audioAvailable && episode) {
      setDuration(parseDuration(episode.duration))
    }
  }, [audioAvailable, episode])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !audioAvailable) return
    if (isPlaying) {
      audio.pause()
      // Save progress
      if (episode) {
        const prog = audio.duration > 0 ? audio.currentTime / audio.duration : 0
        updateEpisode(episode.id, { status: prog >= 0.99 ? 'played' : 'partial', progress: prog })
      }
    } else {
      audio.play()
    }
    setIsPlaying((p) => !p)
  }

  function skip(seconds: number) {
    const audio = audioRef.current
    if (!audio || !audioAvailable) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
  }

  function cycleSpeed() {
    const next = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(next)
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[next]
    }
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    setCurrentTime(newTime)
    if (audioRef.current && audioAvailable) {
      audioRef.current.currentTime = newTime
    }
  }

  if (!episode) {
    return (
      <PhoneShell>
        <div className="h-full flex items-center justify-center" style={{ background: '#0e0e0f' }}>
          <p style={{ color: '#9b9890' }}>Episode not found</p>
        </div>
      </PhoneShell>
    )
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <PhoneShell>
      <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0e0e0f' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 cursor-pointer"
            style={{ color: '#9b9890', background: 'none', border: 'none' }}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px]">Back</span>
          </button>
          <span className="text-[13px] font-medium" style={{ color: '#9b9890' }}>
            Now Playing
          </span>
          <div style={{ width: 60 }} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5">
          {/* Artwork */}
          <div
            className="w-full rounded-[16px] flex flex-col items-center justify-center mb-5"
            style={{
              aspectRatio: '1',
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {audioAvailable || episode.audioFile ? (
              <>
                <div
                  className="text-[22px] mb-1"
                  style={{ fontFamily: 'var(--font-playfair)', color: accent }}
                >
                  Brief<span style={{ color: '#f0ede8' }}>cast</span>
                </div>
                <div className="text-[12px] mb-6" style={{ color: '#9b9890' }}>
                  {episode.edition === 'morning' ? 'Morning Edition' : 'Evening Edition'}
                </div>
                <Waveform isPlaying={isPlaying} accent={accent} />
              </>
            ) : (
              <>
                <div className="text-4xl mb-3" style={{ color: '#5a5856' }}>🎙</div>
                <div
                  className="text-[18px] mb-2"
                  style={{ fontFamily: 'var(--font-playfair)', color: '#9b9890' }}
                >
                  Briefcast
                </div>
                <div className="text-[12px] text-center px-8" style={{ color: '#5a5856' }}>
                  Episode audio coming soon
                </div>
              </>
            )}
          </div>

          {/* Episode info */}
          <div className="text-center mb-5">
            <p className="text-[11px] mb-1" style={{ color: '#5a5856' }}>
              {episode.date}
            </p>
            <h2
              className="text-[20px] mb-1 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', color: '#f0ede8' }}
            >
              {episode.title}
            </h2>
            <p className="text-[11px]" style={{ color: accent }}>
              Briefcast · {episode.edition === 'morning' ? 'Morning' : 'Evening'} edition
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div
              className="w-full h-1 rounded-full cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full relative"
                style={{ width: `${progress * 100}%`, background: accent, transition: 'width 0.1s linear' }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ background: accent, right: -6 }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color: '#5a5856' }}>
                {formatTime(currentTime)}
              </span>
              <span className="text-[10px]" style={{ color: '#5a5856' }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Skip back 15s */}
            <button
              onClick={() => skip(-15)}
              disabled={!audioAvailable}
              className="cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: audioAvailable ? '#f0ede8' : '#3a3836',
                opacity: audioAvailable ? 1 : 0.4,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 5C9 5 5 9 5 14s4 9 9 9 9-4 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 5l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="14" y="16" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="var(--font-dm-sans)">15</text>
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={!audioAvailable}
              className="cursor-pointer"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: audioAvailable ? accent : '#1e1e21',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.93)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {isPlaying ? (
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <rect x="1" y="1" width="6" height="18" rx="2" fill={audioAvailable ? '#0e0e0f' : '#5a5856'} />
                  <rect x="11" y="1" width="6" height="18" rx="2" fill={audioAvailable ? '#0e0e0f' : '#5a5856'} />
                </svg>
              ) : (
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path d="M2 1l14 9-14 9V1z" fill={audioAvailable ? '#0e0e0f' : '#5a5856'} />
                </svg>
              )}
            </button>

            {/* Skip forward 30s */}
            <button
              onClick={() => skip(30)}
              disabled={!audioAvailable}
              className="cursor-pointer"
              style={{
                background: 'none',
                border: 'none',
                color: audioAvailable ? '#f0ede8' : '#3a3836',
                opacity: audioAvailable ? 1 : 0.4,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 5c5 0 9 4 9 9s-4 9-9 9-9-4-9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 5l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="14" y="16" textAnchor="middle" fontSize="7" fill="currentColor" fontFamily="var(--font-dm-sans)">30</text>
              </svg>
            </button>
          </div>

          {/* No audio message */}
          {!audioAvailable && episode.audioFile && (
            <div
              className="text-center text-[11px] mb-4 px-4 py-3 rounded-[12px]"
              style={{ background: '#161618', color: '#9b9890' }}
            >
              Add audio file to <span style={{ color: '#e8a94a', fontFamily: 'monospace' }}>public/audio/morning-episode.mp3</span> to enable playback
            </div>
          )}

          {/* Action bar */}
          <div
            className="flex items-center justify-around py-3 mb-4 rounded-[16px]"
            style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Share */}
            <button className="flex flex-col items-center gap-1 cursor-pointer" style={{ background: 'none', border: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#9b9890" strokeWidth="1.3" />
                <path d="M7.5 11.5l5 3M12.5 5.5l-5 3" stroke="#9b9890" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[9px]" style={{ color: '#5a5856' }}>Share</span>
            </button>

            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="flex flex-col items-center gap-1 cursor-pointer"
              style={{ background: 'none', border: 'none' }}
            >
              <div
                className="text-[13px] font-semibold w-8 h-8 flex items-center justify-center rounded-[8px]"
                style={{ color: '#f0ede8', background: '#1e1e21' }}
              >
                {SPEEDS[speedIndex]}x
              </div>
              <span className="text-[9px]" style={{ color: '#5a5856' }}>Speed</span>
            </button>

            {/* Script */}
            <button
              onClick={() => setShowScript((s) => !s)}
              className="flex flex-col items-center gap-1 cursor-pointer"
              style={{ background: 'none', border: 'none' }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-[8px]"
                style={{ background: showScript ? 'rgba(232,169,74,0.15)' : '#1e1e21' }}
              >
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path d="M1 2h14M1 7h14M1 12h8" stroke={showScript ? '#e8a94a' : '#9b9890'} strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[9px]" style={{ color: showScript ? '#e8a94a' : '#5a5856' }}>Script</span>
            </button>

            {/* Sleep timer */}
            <button className="flex flex-col items-center gap-1 cursor-pointer" style={{ background: 'none', border: 'none' }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-[8px]" style={{ background: '#1e1e21' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 9A6 6 0 1 1 7 2a4.5 4.5 0 0 0 7 7z" stroke="#9b9890" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[9px]" style={{ color: '#5a5856' }}>Sleep</span>
            </button>
          </div>

          {/* Script transcript */}
          {showScript && (
            <div
              className="rounded-[16px] overflow-hidden mb-4"
              style={{
                background: '#161618',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: '#5a5856', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                Transcript
              </div>
              <ScriptTranscript currentLine={currentLine} />
            </div>
          )}
        </div>
      </div>
    </PhoneShell>
  )
}
