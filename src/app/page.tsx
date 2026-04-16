'use client'

import Image from 'next/image'
import { ViewTransition } from 'react'
import PhoneShell from '@/components/PhoneShell'
import EpisodeCard from '@/components/EpisodeCard'
import { useEpisodes } from '@/lib/EpisodeContext'
import { USER } from '@/data/user'
import { WEATHER } from '@/data/weather'

export default function Home() {
  const { episodes } = useEpisodes()

  const todayEpisodes = episodes.filter((ep) => ep.dateShort === 'Today')
  const todayEpisodesOnHome = todayEpisodes.filter(
    (ep) => ep.edition !== 'evening' || ep.audioFile !== null,
  )
  const previousEpisodes = episodes.filter((ep) => ep.dateShort !== 'Today')
  const nextEpisode = todayEpisodesOnHome[0]
  const totalTodayDuration = todayEpisodesOnHome.reduce((sum, ep) => {
    const [minutes, seconds] = ep.duration.split(':').map(Number)
    return sum + minutes * 60 + seconds
  }, 0)
  const totalTodayMinutes = Math.ceil(totalTodayDuration / 60)

  return (
    <PhoneShell>
      <ViewTransition
        enter={{ 'nav-back': 'nav-back', default: 'none' }}
        exit={{ 'nav-forward': 'nav-forward', default: 'none' }}
      >
        <div className="h-full overflow-y-auto" style={{ background: '#f2f2f7' }}>
          <div className="px-4 pb-10">
            <div className="pt-4 pb-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[13px] mb-1" style={{ color: 'rgba(60,60,67,0.72)' }}>
                    Good morning, {USER.name}
                  </p>
                  <h1
                    className="text-[34px] leading-none tracking-[-0.03em] font-bold"
                    style={{ color: '#111111', fontFamily: 'var(--rounded-font)' }}
                  >
                    HyperRadio
                  </h1>
                </div>

                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center mt-1"
                  style={{
                    background: 'rgba(255,255,255,0.78)',
                    border: '0.5px solid rgba(60,60,67,0.16)',
                    boxShadow: '0 6px 18px rgba(60,60,67,0.08)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                  }}
                >
                  <Image
                    src="/logo.svg"
                    alt="HyperRadio"
                    width={20}
                    height={20}
                    className="block h-5 w-auto brightness-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[12px] px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.74)',
                    color: '#111111',
                    border: '0.5px solid rgba(60,60,67,0.16)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                  }}
                >
                  {USER.city}
                </span>
                <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.72)' }}>{WEATHER.morning.temp}</span>
                <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.38)' }}>·</span>
                <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.72)' }}>{WEATHER.morning.condition}</span>
                <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.38)' }}>·</span>
                <span className="text-[12px]" style={{ color: 'rgba(60,60,67,0.45)' }}>Wed Apr 16</span>
              </div>
            </div>

            {nextEpisode && (
              <section className="mb-8">
                <div
                  className="rounded-[28px] p-4 overflow-hidden relative"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(249,249,252,0.9) 100%)',
                    border: '0.5px solid rgba(60,60,67,0.12)',
                    boxShadow: '0 12px 32px rgba(60,60,67,0.08)',
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-28"
                    style={{
                      background: 'linear-gradient(180deg, rgba(10,132,255,0.16) 0%, rgba(10,132,255,0) 100%)',
                    }}
                  />
                  <div className="relative flex items-start justify-between gap-3 mb-5">
                    <div>
                      <div className="text-[13px] font-semibold mb-2" style={{ color: '#0a84ff' }}>
                        Podcast Overview
                      </div>
                      <h2
                        className="text-[28px] leading-[1.08] tracking-[-0.03em] font-semibold mb-2"
                        style={{ color: '#111111', maxWidth: 240 }}
                      >
                        Your commute briefing is ready.
                      </h2>
                      <p className="text-[14px] leading-[1.35] max-w-[250px]" style={{ color: 'rgba(60,60,67,0.72)' }}>
                        Today&apos;s stream blends company updates, design signals, and the stories worth carrying into your morning.
                      </p>
                    </div>

                    <div
                      className="rounded-[20px] overflow-hidden shrink-0"
                      style={{ width: 92, height: 112, boxShadow: '0 12px 24px rgba(10,132,255,0.12)' }}
                    >
                      <Image src="/album_cover.png" alt="" width={84} height={104} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="relative grid grid-cols-3 gap-2">
                    <div
                      className="rounded-[20px] px-3 py-3"
                      style={{ background: 'rgba(120,120,128,0.08)' }}
                    >
                      <div className="text-[11px] mb-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Today</div>
                      <span
                        className="text-[16px] font-semibold"
                        style={{ color: '#111111' }}
                      >
                        {todayEpisodesOnHome.length}
                      </span>
                    </div>
                    <div
                      className="rounded-[20px] px-3 py-3"
                      style={{ background: 'rgba(120,120,128,0.08)' }}
                    >
                      <div className="text-[11px] mb-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Listen time</div>
                      <span className="text-[16px] font-semibold" style={{ color: '#111111' }}>
                        {totalTodayMinutes} min
                      </span>
                    </div>
                    <div
                      className="rounded-[20px] px-3 py-3"
                      style={{ background: 'rgba(120,120,128,0.08)' }}
                    >
                      <div className="text-[11px] mb-1" style={{ color: 'rgba(60,60,67,0.6)' }}>Up next</div>
                      <span className="text-[16px] font-semibold" style={{ color: '#111111' }}>
                        {nextEpisode.edition === 'morning' ? 'Morning' : 'Evening'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {todayEpisodesOnHome.length > 0 && (
              <section className="mb-8">
                <div className="flex items-end justify-between px-1 mb-3">
                  <div className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: '#111111' }}>
                    Today
                  </div>
                  <div className="text-[13px]" style={{ color: 'rgba(60,60,67,0.6)' }}>
                    {todayEpisodesOnHome.length} episodes
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {todayEpisodesOnHome.map((ep) => (
                    <EpisodeCard key={ep.id} episode={ep} />
                  ))}
                </div>
              </section>
            )}

            <section className="mb-6">
              <div className="flex items-end justify-between px-1 mb-3">
                <div className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: '#111111' }}>
                  Previous Episodes
                </div>
                <div className="text-[13px]" style={{ color: 'rgba(60,60,67,0.6)' }}>
                  Keep listening
                </div>
              </div>
              <div className="flex flex-col gap-3">
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
