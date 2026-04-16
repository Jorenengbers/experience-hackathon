'use client'

import { useEffect, useRef } from 'react'

interface Props {
  isPlaying: boolean
  accent: string
}

const BAR_COUNT = 12
const BAR_HEIGHTS = [20, 35, 50, 28, 45, 60, 32, 48, 38, 55, 25, 42]

export default function Waveform({ isPlaying, accent }: Props) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    startTimeRef.current = performance.now()

    function animate(now: number) {
      const elapsed = now - startTimeRef.current
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const phase = (elapsed / 400 + i * 0.4) % (Math.PI * 2)
        const base = BAR_HEIGHTS[i]
        const scale = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(phase))
        bar.style.height = `${base * scale}px`
      })
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying])

  return (
    <div className="flex items-center justify-center gap-[3px]" style={{ height: 64 }}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { barsRef.current[i] = el }}
          style={{
            width: 3,
            height: BAR_HEIGHTS[i] * 0.4,
            borderRadius: 2,
            background: accent,
            opacity: isPlaying ? 0.9 : 0.4,
            transition: isPlaying ? 'none' : 'height 0.3s ease, opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}
