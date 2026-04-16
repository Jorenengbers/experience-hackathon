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
  const accent = isMorning ? '#ea9ffd' : '#7eb8f7'
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
        className="relative overflow-hidden rounded-[24px] cursor-pointer"
        style={{
          background: 'linear-gradient(180deg, rgba(44,48,60,0.72) 0%, rgba(19,22,29,0.92) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: cardOpacity,
          transition: 'transform 0.15s ease',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${isMorning ? 'rgba(234,159,253,0.16)' : 'rgba(126,184,247,0.16)'} 0%, rgba(0,0,0,0) 38%)`,
          }}
        />

        {/* Unplayed dot */}
        {episode.status === 'unplayed' && (
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
        )}

        <div className="p-4 relative">
          <div className="flex items-start gap-3">
            <div
              className="rounded-[18px] overflow-hidden shrink-0"
              style={{ width: 76, height: 92, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {isMorning ? (
                <Image src="/album_cover.png" alt="" width={76} height={92} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="h-full w-full flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(180deg, rgba(38,48,76,0.9) 0%, rgba(20,23,32,0.9) 100%)' }}
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: '#7eb8f7' }}>
                    PM
                  </span>
                  <span className="text-[18px]" style={{ fontFamily: 'var(--font-playfair)', color: '#f6f4ef' }}>
                    HR
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
                  style={{ color: accent, background: 'rgba(255,255,255,0.04)' }}
                >
                  {episode.edition} edition
                </span>
                <span className="text-[10px]" style={{ color: '#6f7680' }}>
                  {episode.dateShort}
                </span>
              </div>

              <div className="text-[20px] mb-2 leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: '#f6f4ef' }}>
                {episode.title || <span style={{ color: '#6f7680', fontStyle: 'italic' }}>Title coming soon</span>}
              </div>

              <div className="text-[12px] mb-4 leading-relaxed" style={{ color: '#bababa' }}>
                {episode.topics.join(' · ')}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border"
                      style={{ background: 'rgba(234,159,253,0.18)', color: '#f3b4ff', borderColor: 'rgba(255,255,255,0.06)', zIndex: 2, position: 'relative' }}
                    >A</div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border"
                      style={{ background: 'rgba(126,184,247,0.18)', color: '#9bd1ff', borderColor: 'rgba(255,255,255,0.06)', marginLeft: -8, zIndex: 1, position: 'relative' }}
                    >S</div>
                  </div>
                  <span className="text-[11px]" style={{ color: '#9ea5af' }}>{episode.duration}</span>
                </div>

                {isUnavailable ? (
                  <div
                    className="text-[10px] px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(49,49,49,0.45)',
                      color: '#bababa',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    Ready at 18:00
                  </div>
                ) : (isPlayed || isPartial) ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(49,49,49,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M1 1l8 5-8 5V1z" fill="#9ea5af" />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: accent, boxShadow: `0 10px 28px ${isMorning ? 'rgba(234,159,253,0.28)' : 'rgba(126,184,247,0.24)'}` }}
                  >
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M1 1l8 5-8 5V1z" fill="#0d1015" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at bottom */}
        {(isPlayed || isPartial) && (
          <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
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
