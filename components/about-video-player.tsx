'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_VIDEO_ID = 'GEpd0kqzSHs'
const POSTER_SRC = '/images/company/gf-company-01.jpg'

function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0]
      return id && id.length >= 6 ? id : null
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.slice('/embed/'.length).split('/')[0] ?? null
      }
      const v = url.searchParams.get('v')
      if (v) return v
    }
  } catch {
    return null
  }
  return null
}

function buildYoutubeNoCookieEmbed(videoId: string): string {
  const u = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`)
  u.searchParams.set('autoplay', '1')
  u.searchParams.set('mute', '1')
  u.searchParams.set('loop', '1')
  u.searchParams.set('playlist', videoId)
  u.searchParams.set('controls', '0')
  u.searchParams.set('modestbranding', '1')
  u.searchParams.set('rel', '0')
  u.searchParams.set('playsinline', '1')
  u.searchParams.set('disablekb', '1')
  u.searchParams.set('iv_load_policy', '3')
  u.searchParams.set('enablejsapi', '1')
  return u.toString()
}

export function AboutVideoPlayer() {
  const [surfaceReady, setSurfaceReady] = useState(false)

  const { embedSrc, videoId } = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_ABOUT_VIDEO_EMBED?.trim()
    const id = env ? extractYoutubeVideoId(env) ?? DEFAULT_VIDEO_ID : DEFAULT_VIDEO_ID
    return { embedSrc: buildYoutubeNoCookieEmbed(id), videoId: id }
  }, [])

  useEffect(() => {
    const failSafe = window.setTimeout(() => setSurfaceReady(true), 6000)
    return () => window.clearTimeout(failSafe)
  }, [])

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-lg',
        'ring-1 ring-black/5',
      )}
    >
      <iframe
        src={embedSrc}
        title="Glacier Fresh company video"
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setSurfaceReady(true)}
      />

      {/* Poster + custom chrome (hides until iframe reports load) */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex flex-col transition-opacity duration-500 ease-out',
          surfaceReady ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        aria-hidden={surfaceReady}
      >
        <div className="absolute inset-0">
          <Image
            src={POSTER_SRC}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-secondary/20" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div
            className={cn(
              'flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full',
              'bg-primary text-primary-foreground shadow-xl shadow-primary/30',
              'ring-[6px] ring-primary/20 md:h-[5.25rem] md:w-[5.25rem] md:ring-8 md:ring-primary/25',
            )}
          >
            <Play
              className="ml-1 size-10 fill-current stroke-[0.5] md:size-12"
              stroke="currentColor"
              aria-hidden
            />
          </div>
          <p className="font-heading text-center text-sm font-medium tracking-wide text-white/95 md:text-base">
            Company overview
          </p>
        </div>
      </div>

      <span className="sr-only">Video: Glacier Fresh (YouTube ID {videoId})</span>
    </div>
  )
}
