'use client'

import { useRouter } from 'next/navigation'
import type { Episode } from '@/lib/types'

interface Props {
  episode: Episode
}

export default function EpisodeCard({ episode }: Props) {
  const router = useRouter()
  const isMorning = episode.edition === 'morning'
  const accent = isMorning ? '#e8a94a' : '#7eb8f7'
  const isPlayed = episode.status === 'played'
  const isPartial = episode.status === 'partial'
  const isUnavailable = episode.audioFile === null && episode.status === 'unplayed'

  const cardOpacity = isPlayed ? 0.55 : isPartial ? 0.75 : 1

  function handleTap() {
    if (episode.audioFile !== null || episode.status !== 'unplayed') {
      // Only navigate if the episode is accessible
    }
    router.push(`/player/${episode.id}`)
  }

  return (
    <div
      onClick={handleTap}
      className="relative overflow-hidden rounded-[16px] cursor-pointer"
      style={{
        background: '#161618',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: cardOpacity,
        transition: 'transform 0.15s ease, opacity 0.15s ease',
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(0.98)'
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
      }}
    >
      {/* Top accent border */}
      <div style={{ height: 2, background: accent, borderRadius: '16px 16px 0 0' }} />

      {/* Unplayed dot */}
      {episode.status === 'unplayed' && (
        <div
          className="absolute top-4 right-4 w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
      )}

      <div className="p-4">
        {/* Edition label */}
        <div
          className="text-[10px] font-semibold tracking-widest uppercase mb-1"
          style={{ color: accent }}
        >
          {episode.edition} edition
        </div>

        {/* Title */}
        <div
          className="text-[18px] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)', color: '#f0ede8' }}
        >
          {episode.title}
        </div>

        {/* Topics + duration meta */}
        <div className="text-[11px] mb-3" style={{ color: '#9b9890' }}>
          {episode.topics.join(' · ')} · {episode.duration}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Host avatars + duration */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-[#0e0e0f]"
                style={{ background: '#2d2010', color: '#e8a94a', zIndex: 2, position: 'relative' }}
              >
                A
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-[#0e0e0f]"
                style={{ background: '#102030', color: '#7eb8f7', marginLeft: -8, zIndex: 1, position: 'relative' }}
              >
                S
              </div>
            </div>
            <span className="text-[11px]" style={{ color: '#9b9890' }}>
              {episode.duration}
            </span>
          </div>

          {/* Play button or Ready label */}
          {isUnavailable ? (
            <div
              className="text-[10px] px-3 py-1 rounded-full"
              style={{ background: '#1e1e21', color: '#9b9890', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Ready at 18:00
            </div>
          ) : (isPlayed || isPartial) ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#1e1e21' }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1l8 5-8 5V1z" fill="#5a5856" />
              </svg>
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: accent }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1l8 5-8 5V1z" fill="#0e0e0f" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar at bottom */}
      {(isPlayed || isPartial) && (
        <div className="h-[2px] w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full"
            style={{
              width: `${episode.progress * 100}%`,
              background: accent,
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  )
}
