import type { Metadata } from 'next'
import type { Viewport } from 'next'
import './globals.css'
import { EpisodeProvider } from '@/lib/EpisodeContext'

export const metadata: Metadata = {
  title: 'HyperRadio',
  description: 'Your personalised AI podcast for commuters',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f2f2f7]">
        <EpisodeProvider>{children}</EpisodeProvider>
      </body>
    </html>
  )
}
