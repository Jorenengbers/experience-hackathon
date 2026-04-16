'use client'

import { MORNING_SCRIPT } from '@/data/script'

interface Props {
  currentLine: number
}

export default function ScriptTranscript({ currentLine }: Props) {
  return (
    <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
      <div className="flex flex-col gap-3 px-4 pb-4">
        {MORNING_SCRIPT.map((line, i) => {
          const isActive = i === currentLine
          const speakerColor = line.speaker === 'ALEX' ? '#e8a94a' : '#7eb8f7'
          return (
            <div
              key={i}
              style={{ opacity: isActive ? 1 : 0.35, transition: 'opacity 0.3s ease' }}
            >
              <span
                className="text-[10px] font-semibold tracking-widest uppercase mr-2"
                style={{ color: speakerColor }}
              >
                {line.speaker}
              </span>
              <span className="text-[13px] leading-relaxed" style={{ color: '#f0ede8' }}>
                {line.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
