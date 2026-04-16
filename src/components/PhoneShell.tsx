'use client'

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center p-8">
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          background: '#0e0e0f',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.8), 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-50">
          <div
            style={{
              width: 120,
              height: 34,
              borderRadius: 20,
              background: '#000',
            }}
          />
        </div>

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-40 flex items-end justify-between px-8 pb-1"
          style={{ height: 54, paddingTop: 14 }}
        >
          <span className="text-[15px] font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            9:41
          </span>
          <div className="flex items-center gap-[6px]">
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="7" width="3" height="5" rx="1" fill="white" />
              <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="white" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="white" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="white" opacity="0.3" />
            </svg>
            {/* Wifi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" fill="white" />
              <path d="M3.5 6.5C4.9 5.1 6.4 4.3 8 4.3s3.1.8 4.5 2.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M1 3.8C3.1 1.7 5.4.5 8 .5s4.9 1.2 7 3.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-[1px]">
              <div
                style={{
                  width: 25,
                  height: 12,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.5)',
                  padding: '2px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                    borderRadius: 1.5,
                    background: 'white',
                  }}
                />
              </div>
              <div
                style={{
                  width: 2,
                  height: 5,
                  borderRadius: '0 1px 1px 0',
                  background: 'rgba(255,255,255,0.4)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Content area — scrollable */}
        <div
          className="flex-1 overflow-hidden"
          style={{ paddingTop: 54, borderRadius: 52 }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
