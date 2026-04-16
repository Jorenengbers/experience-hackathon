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
  const previousEpisodes = episodes.filter((ep) => ep.dateShort !== 'Today')
  const nextEpisode = todayEpisodes[0]

  return (
    <PhoneShell>
      <ViewTransition
        enter={{ 'nav-back': 'nav-back', default: 'none' }}
        exit={{ 'nav-forward': 'nav-forward', default: 'none' }}
      >
        <div className="h-full overflow-y-auto relative" style={{ background: '#0d1015' }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-x-[-35%] top-[-18%] h-[44%]"
              style={{
                backgroundImage: 'url(/album_cover.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(42px)',
                opacity: 0.2,
              }}
            />
            <div
              className="absolute -top-16 right-[-28%] h-64 w-64 rounded-full"
              style={{ background: 'rgba(234,159,253,0.14)', filter: 'blur(48px)' }}
            />
            <div
              className="absolute top-48 left-[-24%] h-52 w-52 rounded-full"
              style={{ background: 'rgba(126,184,247,0.12)', filter: 'blur(52px)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(13,16,21,0.3) 0%, rgba(13,16,21,0.86) 28%, #0d1015 62%)' }}
            />
          </div>

          <div className="relative px-5 pb-8">
            <div className="pt-4 pb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[12px] mb-1" style={{ color: '#bababa' }}>
                    Good morning, {USER.name}
                  </p>
                  <h1
                    className="text-[30px] leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)', color: '#f6f4ef' }}
                  >
                    Hyper<span style={{ color: '#ea9ffd' }}>Radio</span>
                  </h1>
                </div>

                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(49,49,49,0.55)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <Image
                    src="/logo.svg"
                    alt="HyperRadio"
                    width={20}
                    height={20}
                    className="block h-5 w-auto"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className="text-[11px] px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(49,49,49,0.45)',
                    color: '#f6f4ef',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {USER.city}
                </span>
                <span className="text-[11px]" style={{ color: '#bababa' }}>{WEATHER.morning.temp}</span>
                <span className="text-[11px]" style={{ color: '#6f7680' }}>·</span>
                <span className="text-[11px]" style={{ color: '#bababa' }}>{WEATHER.morning.condition}</span>
                <span className="text-[11px]" style={{ color: '#6f7680' }}>·</span>
                <span className="text-[11px]" style={{ color: '#6f7680' }}>Wed Apr 16</span>
              </div>

              {nextEpisode && (
                <div
                  className="rounded-[24px] p-4"
                  style={{
                    background: 'linear-gradient(180deg, rgba(42,46,58,0.7) 0%, rgba(20,23,30,0.82) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-[10px] font-semibold tracking-[0.24em] uppercase mb-2" style={{ color: '#ea9ffd' }}>
                        Podcast Overview
                      </div>
                      <h2
                        className="text-[24px] leading-[1.1] mb-2"
                        style={{ fontFamily: 'var(--font-playfair)', color: '#f6f4ef' }}
                      >
                        Your commute soundtrack is ready.
                      </h2>
                      <p className="text-[13px] leading-relaxed max-w-[250px]" style={{ color: '#bababa' }}>
                        Today&apos;s stream blends company updates, design signals, and the stories worth carrying into your morning.
                      </p>
                    </div>

                    <div
                      className="rounded-[18px] overflow-hidden shrink-0"
                      style={{ width: 84, height: 104, border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Image src="/album_cover.png" alt="" width={84} height={104} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-[0.18em]"
                        style={{ background: 'rgba(234,159,253,0.14)', color: '#f3b4ff' }}
                      >
                        {todayEpisodes.length} today
                      </span>
                      <span className="text-[11px]" style={{ color: '#9ea5af' }}>
                        {nextEpisode.duration} total listen
                      </span>
                    </div>

                    <span className="text-[11px]" style={{ color: '#6f7680' }}>
                      Swipe into playback
                    </span>
                  </div>
                </div>
              )}
            </div>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-semibold tracking-[0.24em] uppercase" style={{ color: '#6f7680' }}>
                  Today
                </div>
                <div className="text-[11px]" style={{ color: '#9ea5af' }}>
                  {todayEpisodes.length} episodes
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {todayEpisodes.map((ep) => (
                  <EpisodeCard key={ep.id} episode={ep} />
                ))}
              </div>
            </section>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-semibold tracking-[0.24em] uppercase" style={{ color: '#6f7680' }}>
                  Previous Episodes
                </div>
                <div className="text-[11px]" style={{ color: '#9ea5af' }}>
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
