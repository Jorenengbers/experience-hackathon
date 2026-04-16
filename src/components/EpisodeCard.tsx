'use client'

import Image from 'next/image'
import { ViewTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Episode } from '@/lib/types'

interface Props {
  episode: Episode
}

export default function EpisodeCard({ episode }: Props) {
  const router = useRouter()
  const isMorning = episode.edition === 'morning'
  const accent = isMorning ? '#0a84ff' : '#5e5ce6'
  const isPlayed = episode.status === 'played'
  const isPartial = episode.status === 'partial'
  const isUnavailable = episode.audioFile === null && episode.status === 'unplayed'

  const cardOpacity = isPlayed ? 0.55 : isPartial ? 0.75 : 1

  function handleTap() {
    router.push(`/player/${episode.id}`, { transitionTypes: ['nav-forward'] })
  }

  return (
    <ViewTransition name={`episode-card-${episode.id}`} share="card-morph">
      <div
        onClick={handleTap}
        className="relative overflow-hidden rounded-[22px] cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.88)',
          border: '0.5px solid rgba(60,60,67,0.12)',
          opacity: cardOpacity,
          transition: 'transform 0.15s ease',
          boxShadow: '0 10px 28px rgba(60,60,67,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* Unplayed dot */}
        {episode.status === 'unplayed' && (
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        )}

        <div className="p-4 relative">
          <div className="flex items-start gap-3">
            <div
              className="rounded-[18px] overflow-hidden shrink-0"
              style={{ width: 76, height: 76, boxShadow: 'inset 0 0 0 0.5px rgba(60,60,67,0.12)' }}
            >
              <Image src="/album_cover.png" alt="" width={76} height={92} className="h-full w-full object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: accent, background: isMorning ? 'rgba(10,132,255,0.12)' : 'rgba(94,92,230,0.12)' }}
                >
                  {episode.edition === 'morning' ? 'Morning' : 'Evening'}
                </span>
                <span className="text-[11px]" style={{ color: 'rgba(60,60,67,0.5)' }}>
                  {episode.dateShort}
                </span>
              </div>

              <div className="text-[20px] mb-2 leading-tight font-semibold tracking-[-0.02em]" style={{ color: '#111111' }}>
                {episode.title || <span style={{ color: 'rgba(60,60,67,0.5)', fontStyle: 'italic' }}>Title coming soon</span>}
              </div>

              <div className="text-[13px] mb-4 leading-relaxed" style={{ color: 'rgba(60,60,67,0.72)' }}>
                {episode.topics.join(' · ')}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border"
                      style={{ background: 'rgba(10,132,255,0.14)', color: '#0a84ff', borderColor: 'rgba(255,255,255,0.88)', zIndex: 2, position: 'relative' }}
                    >A</div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border"
                      style={{ background: 'rgba(94,92,230,0.14)', color: '#5e5ce6', borderColor: 'rgba(255,255,255,0.88)', marginLeft: -8, zIndex: 1, position: 'relative' }}
                    >S</div>
                  </div>
                  <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.6)' }}>{episode.duration}</span>
                </div>

                {isUnavailable ? (
                  <div
                    className="text-[11px] px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(120,120,128,0.08)',
                      color: 'rgba(60,60,67,0.72)',
                    }}
                  >
                    Ready at 18:00
                  </div>
                ) : (isPlayed || isPartial) ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(120,120,128,0.12)' }}
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M1 1l8 5-8 5V1z" fill="rgba(60,60,67,0.52)" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: accent }}
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M1 1l8 5-8 5V1z" fill="white" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at bottom */}
        {(isPlayed || isPartial) && (
          <div className="h-[3px] w-full" style={{ background: 'rgba(120,120,128,0.12)' }}>
            <div
              className="h-full"
              style={{ width: `${episode.progress * 100}%`, background: accent, borderRadius: 2 }}
            />
          </div>
        )}
      </div>
    </ViewTransition>
  )
}
