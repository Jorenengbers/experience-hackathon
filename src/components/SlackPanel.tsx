'use client'

import { SLACK_MESSAGES } from '@/data/slack'

export default function SlackPanel() {
  const podcastCount = SLACK_MESSAGES.filter((m) => m.inPodcast).length

  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{
        background: '#161618',
        border: '1px solid rgba(255,255,255,0.08)',
        animation: 'slideUp 0.3s ease both',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#c084db' }} />
          <span className="text-[13px] font-medium" style={{ color: '#f0ede8' }}>
            Slack — important contacts
          </span>
        </div>
        <div
          className="text-[10px] px-2 py-[2px] rounded-full font-semibold"
          style={{ background: 'rgba(232,169,74,0.15)', color: '#e8a94a' }}
        >
          {podcastCount} in podcast
        </div>
      </div>

      {/* Messages */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {SLACK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{ opacity: msg.inPodcast ? 1 : 0.4 }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
              style={{ background: msg.avatarColor, color: msg.initialsColor }}
            >
              {msg.initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-medium" style={{ color: '#f0ede8' }}>
                  {msg.sender}
                </span>
                <span
                  className="text-[10px] px-1.5 py-[1px] rounded-full"
                  style={{ background: '#1e1e21', color: '#9b9890' }}
                >
                  {msg.channel}
                </span>
                <span className="text-[10px]" style={{ color: '#5a5856' }}>
                  {msg.time}
                </span>
              </div>
              <p
                className="text-[11px] leading-[1.5] line-clamp-2"
                style={{ color: '#9b9890' }}
              >
                {msg.text}
              </p>
            </div>

            {/* In podcast badge */}
            {msg.inPodcast && (
              <div
                className="text-[9px] px-2 py-[2px] rounded-full flex-shrink-0 mt-0.5 font-semibold"
                style={{ background: 'rgba(232,169,74,0.12)', color: '#e8a94a', whiteSpace: 'nowrap' }}
              >
                In podcast
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
