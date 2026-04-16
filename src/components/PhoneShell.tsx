'use client'

import { useEffect, useState } from 'react'

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // On real mobile: fill the entire screen, respect safe areas
  if (isMobile) {
    return (
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: '100dvw',
          height: '100dvh',
          background: '#f2f2f7',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </div>
    )
  }

  // On desktop: centered iPhone shell
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'radial-gradient(circle at top, #ffffff 0%, #e8ebf2 38%, #dfe3eb 100%)',
      }}
    >
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          background: '#f2f2f7',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 24px 80px rgba(64, 76, 95, 0.2), 0 8px 24px rgba(64, 76, 95, 0.12), inset 0 0 0 1px rgba(255,255,255,0.65)',
          flexShrink: 0,
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-50">
          <div style={{ width: 120, height: 34, borderRadius: 20, background: '#000' }} />
        </div>

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-40 flex items-end justify-between px-8 pb-1"
          style={{ height: 54, paddingTop: 14 }}
        >
          <span className="text-[15px] font-semibold text-black">
            9:41
          </span>
          <div className="flex items-center gap-[6px]">
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="7" width="3" height="5" rx="1" fill="black" />
              <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="black" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="black" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="black" opacity="0.35" />
            </svg>
            {/* Wifi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="black" />
              <path d="M3.5 6.5C4.9 5.1 6.4 4.3 8 4.3s3.1.8 4.5 2.2" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M1 3.8C3.1 1.7 5.4.5 8 .5s4.9 1.2 7 3.3" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-[1px]">
              <div style={{ width: 25, height: 12, borderRadius: 3, border: '1px solid rgba(0,0,0,0.45)', padding: '2px' }}>
                <div style={{ width: '80%', height: '100%', borderRadius: 1.5, background: 'black' }} />
              </div>
              <div style={{ width: 2, height: 5, borderRadius: '0 1px 1px 0', background: 'rgba(0,0,0,0.35)' }} />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden" style={{ paddingTop: 54, borderRadius: 52 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
