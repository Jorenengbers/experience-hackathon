'use client'

import { ViewTransition } from 'react'
import PhoneShell from '@/components/PhoneShell'
import EpisodeCard from '@/components/EpisodeCard'
import { useEpisodes } from '@/lib/EpisodeContext'
import { USER } from '@/data/user'
import { WEATHER } from '@/data/weather'

export default function Home() {
  const { episodes } = useEpisodes()

  const todayEpisodes = episodes.filter((ep) => ep.dateShort === 'Today')
  const previousEpisodes = episodes.filter((ep) => ep.dateShort !== 'Today')

  return (
    <PhoneShell>
      <ViewTransition
        enter={{ 'nav-back': 'nav-back', default: 'none' }}
        exit={{ 'nav-forward': 'nav-forward', default: 'none' }}
      >
        <div className="h-full overflow-y-auto" style={{ background: '#0e0e0f' }}>
          <div className="px-5 pb-8">
            {/* Header */}
            <div className="pt-4 pb-4">
              <p className="text-[12px] mb-1" style={{ color: '#9b9890' }}>
                Good morning, {USER.name}
              </p>
              <h1 className="text-[28px] leading-tight mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#f0ede8' }}>
                Hyper<span style={{ color: '#e8a94a' }}>Radio</span>
              </h1>

              {/* Weather row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{ background: '#1e1e21', color: '#9b9890', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {USER.city}
                </span>
                <span className="text-[11px]" style={{ color: '#9b9890' }}>{WEATHER.morning.temp}</span>
                <span className="text-[11px]" style={{ color: '#5a5856' }}>·</span>
                <span className="text-[11px]" style={{ color: '#9b9890' }}>{WEATHER.morning.condition}</span>
                <span className="text-[11px]" style={{ color: '#5a5856' }}>·</span>
                <span className="text-[11px]" style={{ color: '#5a5856' }}>Wed Apr 16</span>
              </div>
            </div>

            {/* Today's Episodes */}
            <section className="mb-6">
              <div className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#5a5856' }}>
                Today
              </div>
              <div className="flex flex-col gap-2.5">
                {todayEpisodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            </section>

            {/* Previous Episodes */}
            <section className="mb-6">
              <div className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: '#5a5856' }}>
                Previous Episodes
              </div>
              <div className="flex flex-col gap-2.5">
                {previousEpisodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            </section>

          </div>
        </div>
      </ViewTransition>
    </PhoneShell>
  )
}
