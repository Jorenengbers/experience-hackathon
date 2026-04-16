'use client'

import { createContext, useContext, useState } from 'react'
import { EPISODES } from '@/data/episodes'
import type { Episode } from '@/lib/types'

interface EpisodeContextValue {
  episodes: Episode[]
  updateEpisode: (id: string, patch: Partial<Episode>) => void
}

const EpisodeContext = createContext<EpisodeContextValue | null>(null)

export function EpisodeProvider({ children }: { children: React.ReactNode }) {
  const [episodes, setEpisodes] = useState<Episode[]>(EPISODES)

  function updateEpisode(id: string, patch: Partial<Episode>) {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, ...patch } : ep))
    )
  }

  return (
    <EpisodeContext.Provider value={{ episodes, updateEpisode }}>
      {children}
    </EpisodeContext.Provider>
  )
}

export function useEpisodes() {
  const ctx = useContext(EpisodeContext)
  if (!ctx) throw new Error('useEpisodes must be used inside EpisodeProvider')
  return ctx
}
