'use client'

import { use, useEffect, useRef, useState, ViewTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneShell from '@/components/PhoneShell'
import Waveform from '@/components/Waveform'
import { useEpisodes } from '@/lib/EpisodeContext'

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
  const { episodes, updateEpisode } = useEpisodes()

  const episode = episodes.find((ep) => ep.id === id)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioAvailable, setAudioAvailable] = useState(false)

  const isMorning = episode?.edition === 'morning'
  const accent = '#ea9ffd'
  const albumCover = isMorning ? '/album_cover.png' : null

  useEffect(() => {
    if (!episode?.audioFile) return

    const audio = new Audio(episode.audioFile)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setAudioAvailable(true)
      if (episode.progress > 0 && episode.progress < 1) {
        audio.currentTime = audio.duration * episode.progress
        setCurrentTime(audio.currentTime)
      }
    })
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      updateEpisode(episode.id, { status: 'played', progress: 1 })
    })
    audio.addEventListener('error', () => setAudioAvailable(false))

    return () => { audio.pause(); audio.src = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id, episode?.audioFile])

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

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = ratio * duration
    setCurrentTime(newTime)
    if (audioRef.current && audioAvailable) audioRef.current.currentTime = newTime
  }

  if (!episode) {
    return (
      <PhoneShell>
        <div className="h-full flex items-center justify-center" style={{ background: '#0d1015' }}>
          <p style={{ color: '#9b9890' }}>Episode not found</p>
        </div>
      </PhoneShell>
    )
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <PhoneShell>
      <ViewTransition
        enter={{ 'nav-forward': 'nav-forward', default: 'none' }}
        exit={{ 'nav-back': 'nav-back', default: 'none' }}
      >
      <div className="h-full flex flex-col overflow-hidden relative" style={{ background: '#0d1015' }}>

        {/* Blurred background from album art */}
        {albumCover && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumCover}
              alt=""
              className="absolute"
              style={{
                width: '280%',
                height: '280%',
                top: '-90%',
                left: '-90%',
                objectFit: 'cover',
                filter: 'blur(25px)',
                opacity: 0.2,
              }}
            />
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative" style={{ zIndex: 1 }}>
          <div className="px-4 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between pt-4 pb-6">
              <Link
                href="/"
                transitionTypes={['nav-back']}
                className="flex items-center gap-2 cursor-pointer h-10 px-4 rounded-full"
                style={{
                  background: 'rgba(49,49,49,0.85)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6l5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Back</span>
              </Link>

              <Image
                src="/logo.svg"
                alt="Briefcast"
                width={25}
                height={24}
                className="block h-6 w-auto"
              />

              {/* Spacer to balance */}
              <div style={{ width: 84 }} />
            </div>

            {/* Album artwork */}
            <ViewTransition name={`episode-card-${episode.id}`} share="card-morph">
              <div
                className="w-full rounded-[16px] overflow-hidden mb-6 relative"
                style={{ aspectRatio: '1' }}
              >
                {albumCover ? (
                  <>
                    <Image src={albumCover} alt="Album cover" width={358} height={358} className="w-full h-full object-cover" />
                    {isPlaying && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Waveform isPlaying={isPlaying} accent={accent} />
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{ background: '#1a1a2e' }}
                  >
                    <div className="text-[22px] mb-2" style={{ fontFamily: 'var(--font-playfair)', color: accent }}>
                      HyperRadio
                    </div>
                    <div className="text-[13px] mb-6" style={{ color: '#9b9890' }}>
                      {episode.edition === 'morning' ? 'Morning Edition' : 'Evening Edition'}
                    </div>
                    <Waveform isPlaying={isPlaying} accent={accent} />
                  </div>
                )}
              </div>
            </ViewTransition>

            {/* Episode info */}
            <div className="text-center mb-6">
              <p className="text-[16px] font-semibold mb-2" style={{ color: accent }}>
                HyperRadio {episode.edition === 'morning' ? 'Morning' : 'Evening'} Edition
              </p>
              <h2
                className="text-[24px] font-semibold mb-2 leading-tight"
                style={{ color: 'white' }}
              >
                {episode.title || <span style={{ color: '#5a5856', fontStyle: 'italic' }}>Title coming soon</span>}
              </h2>
              <p className="text-[14px]" style={{ color: '#bababa' }}>
                {episode.date.replace(' ·', '')}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div
                className="w-full rounded-full cursor-pointer"
                style={{ height: 8, background: '#313131' }}
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: accent,
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[12px]" style={{ color: '#bababa' }}>{formatTime(currentTime)}</span>
                <span className="text-[12px]" style={{ color: '#bababa' }}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between mb-6 px-6">
              {/* Skip back 10s */}
              <button
                onClick={() => skip(-10)}
                disabled={!audioAvailable}
                style={{ background: 'none', border: 'none', opacity: audioAvailable ? 1 : 0.35, cursor: 'pointer' }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 8l-4-4m4 4l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="20" y="23" textAnchor="middle" fontSize="9" fill="white" fontWeight="600">10</text>
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                disabled={!audioAvailable}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: audioAvailable ? accent : '#313131',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {isPlaying ? (
                  /* Pause — two rounded bars */
                  <div className="flex items-center gap-[10px]">
                    <div style={{ width: 8, height: 39, borderRadius: 300, background: '#0d1015' }} />
                    <div style={{ width: 8, height: 39, borderRadius: 300, background: '#0d1015' }} />
                  </div>
                ) : (
                  /* Play triangle */
                  <svg width="30" height="34" viewBox="0 0 30 34" fill="none" style={{ marginLeft: 4 }}>
                    <path d="M2 2l26 15L2 32V2z" fill="#0d1015" />
                  </svg>
                )}
              </button>

              {/* Skip forward 10s */}
              <button
                onClick={() => skip(10)}
                disabled={!audioAvailable}
                style={{ background: 'none', border: 'none', opacity: audioAvailable ? 1 : 0.35, cursor: 'pointer' }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 8c6.6 0 12 5.4 12 12s-5.4 12-12 12S8 26.6 8 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 8l4-4m-4 4l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="20" y="23" textAnchor="middle" fontSize="9" fill="white" fontWeight="600">10</text>
                </svg>
              </button>
            </div>


            {/* No audio message */}
            {!audioAvailable && episode.audioFile && (
              <div
                className="text-center text-[11px] px-4 py-3 rounded-[12px]"
                style={{ background: 'rgba(49,49,49,0.6)', color: '#9b9890' }}
              >
                Add audio file to{' '}
                <span style={{ color: accent, fontFamily: 'monospace' }}>public/audio/morning-episode.mp3</span>{' '}
                to enable playback
              </div>
            )}

          </div>
        </div>
      </div>
      </ViewTransition>
    </PhoneShell>
  )
}
