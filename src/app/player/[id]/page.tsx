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
  const accent = isMorning ? '#0a84ff' : '#5e5ce6'
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
        <div className="h-full flex items-center justify-center" style={{ background: '#f2f2f7' }}>
          <p style={{ color: 'rgba(60,60,67,0.72)' }}>Episode not found</p>
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
      <div className="h-full flex flex-col overflow-hidden relative" style={{ background: '#101114' }}>

        {/* Blurred background from album art */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {albumCover ? (
            <div
              className="absolute inset-[-32%]"
              style={{
                backgroundImage: `url(${albumCover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(56px) saturate(1.05)',
                transform: 'scale(1.15)',
                opacity: 0.68,
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at top, rgba(94,92,230,0.42) 0%, rgba(16,17,20,0) 48%)' }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(16,17,20,0.18) 0%, rgba(16,17,20,0.4) 28%, rgba(16,17,20,0.92) 100%)' }}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative" style={{ zIndex: 1 }}>
          <div className="px-5 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between pt-4 pb-7">
              <Link
                href="/"
                transitionTypes={['nav-back']}
                className="flex items-center justify-center h-10 w-10 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  color: 'white',
                  textDecoration: 'none',
                  boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.18)',
                }}
              >
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                  <path d="M7.8 2.2L2.5 8l5.3 5.8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Image
                src="/logo.svg"
                alt="Briefcast"
                width={25}
                height={24}
                className="block h-6 w-auto"
              />

              {/* Spacer to balance */}
              <div style={{ width: 40 }} />
            </div>

            {/* Album artwork */}
            <ViewTransition name={`episode-card-${episode.id}`} share="card-morph">
              <div
                className="w-full rounded-[24px] overflow-hidden mb-8 relative"
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
                    style={{ background: 'linear-gradient(180deg, #7d7bf7 0%, #5e5ce6 100%)' }}
                  >
                    <div className="text-[24px] mb-2 font-semibold tracking-[-0.02em] text-white">
                      HyperRadio
                    </div>
                    <div className="text-[13px] mb-6 text-white/75">
                      {episode.edition === 'morning' ? 'Morning Edition' : 'Evening Edition'}
                    </div>
                    <Waveform isPlaying={isPlaying} accent={accent} />
                  </div>
                )}
              </div>
            </ViewTransition>

            {/* Episode info */}
            <div className="text-center mb-7">
              <p className="text-[15px] font-medium mb-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                HyperRadio {episode.edition === 'morning' ? 'Morning' : 'Evening'} Edition
              </p>
              <h2
                className="text-[30px] font-semibold mb-2 leading-tight tracking-[-0.03em]"
                style={{ color: 'white' }}
              >
                {episode.title || <span style={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>Title coming soon</span>}
              </h2>
              <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {episode.date.replace(' ·', '')}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div
                className="w-full rounded-full cursor-pointer"
                style={{ height: 6, background: 'rgba(255,255,255,0.18)' }}
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: '#ffffff',
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[13px] tabular-nums" style={{ color: 'rgba(255,255,255,0.68)' }}>{formatTime(currentTime)}</span>
                <span className="text-[13px] tabular-nums" style={{ color: 'rgba(255,255,255,0.68)' }}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between mb-7 px-4">
              {/* Skip back 10s */}
              <button
                onClick={() => skip(-10)}
                disabled={!audioAvailable}
                className="h-12 w-12 flex items-center justify-center rounded-full"
                style={{ background: 'transparent', border: 'none', opacity: audioAvailable ? 1 : 0.35 }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <path d="M22 9C14.82 9 9 14.82 9 22s5.82 13 13 13 13-5.82 13-13" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
                  <path d="M22 9l-4.2-4.1m4.2 4.1l-4.2 4.1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="22" y="25.2" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">10</text>
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                disabled={!audioAvailable}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: audioAvailable ? '#ffffff' : 'rgba(255,255,255,0.24)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                  boxShadow: audioAvailable ? '0 18px 36px rgba(0,0,0,0.24)' : 'none',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                {isPlaying ? (
                  /* Pause — two rounded bars */
                  <div className="flex items-center gap-[10px]">
                    <div style={{ width: 8, height: 32, borderRadius: 300, background: '#101114' }} />
                    <div style={{ width: 8, height: 32, borderRadius: 300, background: '#101114' }} />
                  </div>
                ) : (
                  /* Play triangle */
                  <svg width="26" height="30" viewBox="0 0 26 30" fill="none" style={{ marginLeft: 4 }}>
                    <path d="M2 2l22 13L2 28V2z" fill="#101114" />
                  </svg>
                )}
              </button>

              {/* Skip forward 10s */}
              <button
                onClick={() => skip(10)}
                disabled={!audioAvailable}
                className="h-12 w-12 flex items-center justify-center rounded-full"
                style={{ background: 'transparent', border: 'none', opacity: audioAvailable ? 1 : 0.35 }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <path d="M22 9c7.18 0 13 5.82 13 13s-5.82 13-13 13S9 29.18 9 22" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
                  <path d="M22 9l4.2-4.1M22 9l4.2 4.1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="22" y="25.2" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">10</text>
                </svg>
              </button>
            </div>


            {/* No audio message */}
            {!audioAvailable && episode.audioFile && (
              <div
                className="text-center text-[12px] px-4 py-3 rounded-[18px]"
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                Add audio file to{' '}
                <span style={{ color: '#ffffff', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>public/audio/morning-episode.mp3</span>{' '}
                to enable playback
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <div
                style={{
                  width: 140,
                  height: 5,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.82)',
                }}
              />
            </div>

          </div>
        </div>
      </div>
      </ViewTransition>
    </PhoneShell>
  )
}
