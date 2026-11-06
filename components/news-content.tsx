import Image from 'next/image'
import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Store,
} from 'lucide-react'
import type {
  NewsBlock,
  NewsInlineNode,
  NewsStory,
  TradeShow,
} from '@/lib/cms-news'

type NewsContentProps = {
  tradeShows: TradeShow[]
  stories: NewsStory[]
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDate(value: string) {
  const date = parseDate(value)
  return date ? dateFormatter.format(date) : value
}

function formatDateRange(startValue: string, endValue: string) {
  const start = parseDate(startValue)
  const end = parseDate(endValue)

  if (!start || !end) return `${startValue} – ${endValue}`
  if (startValue === endValue) return dateFormatter.format(start)

  if (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()
  ) {
    const month = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      timeZone: 'UTC',
    }).format(start)
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${start.getUTCFullYear()}`
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`
}

function safeLinkUrl(value?: string) {
  if (!value) return undefined

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function getYouTubeEmbedUrl(value?: string) {
  if (!value) return undefined

  try {
    const url = new URL(value)
    const hostname = url.hostname.replace(/^www\./, '')
    let videoId: string | null = null

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      videoId = url.searchParams.get('v')
      if (!videoId && url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2] ?? null
      }
      if (!videoId && url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2] ?? null
      }
    }

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return undefined
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  } catch {
    return undefined
  }
}

function renderInline(children: NewsInlineNode[] | undefined, keyPrefix: string) {
  if (!Array.isArray(children)) return null

  return children.map<ReactNode>((child, index) => {
    const key = `${keyPrefix}-${index}`

    if (child.type === 'link') {
      const href = safeLinkUrl(child.url)
      if (!href) return <span key={key}>{renderInline(child.children, key)}</span>

      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {renderInline(child.children, key)}
        </a>
      )
    }

    let content: ReactNode = child.text
    if (child.code) content = <code>{content}</code>
    if (child.bold) content = <strong>{content}</strong>
    if (child.italic) content = <em>{content}</em>
    if (child.underline) content = <u>{content}</u>
    if (child.strikethrough) content = <s>{content}</s>

    return <span key={key}>{content}</span>
  })
}

function blockText(block: NewsBlock): NewsInlineNode[] {
  return Array.isArray(block.children)
    ? block.children.filter((child): child is NewsInlineNode => child.type === 'text' || child.type === 'link')
    : []
}

function renderBlock(block: NewsBlock, index: number): ReactNode {
  const key = `block-${index}`
  const inline = renderInline(blockText(block), key)

  if (block.type === 'heading') {
    const headingClassName = 'font-heading font-semibold text-secondary'
    if (block.level === 2) return <h2 key={key} className={`${headingClassName} text-2xl`}>{inline}</h2>
    if (block.level === 3) return <h3 key={key} className={`${headingClassName} text-xl`}>{inline}</h3>
    return <h4 key={key} className={`${headingClassName} text-lg`}>{inline}</h4>
  }

  if (block.type === 'quote') {
    return (
      <blockquote key={key} className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {inline}
      </blockquote>
    )
  }

  if (block.type === 'list') {
    const items = Array.isArray(block.children) ? block.children : []
    const listItems = items.map((item, itemIndex) => (
      <li key={`${key}-${itemIndex}`}>{renderInline(blockText(item), `${key}-${itemIndex}`)}</li>
    ))

    return block.format === 'ordered' ? (
      <ol key={key} className="list-decimal space-y-2 pl-5">{listItems}</ol>
    ) : (
      <ul key={key} className="list-disc space-y-2 pl-5">{listItems}</ul>
    )
  }

  return <p key={key}>{inline}</p>
}

function TradeShowCard({ tradeShow }: { tradeShow: TradeShow }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/25 hover:shadow-md md:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        Trade Show
      </p>
      <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-secondary md:text-2xl">
        {tradeShow.title}
      </h3>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="grid grid-cols-[1.25rem_5rem_1fr] gap-3">
          <CalendarDays className="mt-0.5 size-5 text-primary" aria-hidden />
          <dt className="font-semibold text-secondary">Date</dt>
          <dd className="text-muted-foreground">
            {formatDateRange(tradeShow.startDate, tradeShow.endDate)}
          </dd>
        </div>
        <div className="grid grid-cols-[1.25rem_5rem_1fr] gap-3">
          <MapPin className="mt-0.5 size-5 text-primary" aria-hidden />
          <dt className="font-semibold text-secondary">Location</dt>
          <dd className="text-muted-foreground">{tradeShow.location}</dd>
        </div>
        <div className="grid grid-cols-[1.25rem_5rem_1fr] gap-3">
          <Store className="mt-0.5 size-5 text-primary" aria-hidden />
          <dt className="font-semibold text-secondary">Booth</dt>
          <dd className="text-muted-foreground">{tradeShow.boothNumber}</dd>
        </div>
      </dl>

      {tradeShow.externalUrl && (
        <a
          href={tradeShow.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
        >
          Visit event website
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </article>
  )
}

function NewsStoryArticle({ story }: { story: NewsStory }) {
  const embedUrl = getYouTubeEmbedUrl(story.videoUrl)
  const hasMedia = Boolean(story.coverImageUrl || embedUrl)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className={hasMedia ? 'grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]' : undefined}>
        {hasMedia && (
          <div className="flex h-full flex-col justify-center gap-6 bg-muted/30 p-6 md:p-8 lg:p-10">
            {story.coverImageUrl && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={story.coverImageUrl}
                  alt={story.coverImageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            )}
            {embedUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary shadow-sm">
                <iframe
                  src={embedUrl}
                  title={`${story.title} video`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        <div className="p-6 md:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            News Story
          </p>
          <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight text-secondary md:text-3xl">
            {story.title}
          </h3>
          {story.eventDate && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarDays className="size-4 text-primary" aria-hidden />
              <time dateTime={story.eventDate}>{formatDate(story.eventDate)}</time>
            </p>
          )}
          {story.summary && (
            <p className="type-body mt-5 font-medium text-secondary-400">{story.summary}</p>
          )}
          <div className="type-body mt-6 space-y-5 text-muted-foreground">
            {story.content.map(renderBlock)}
          </div>
        </div>
      </div>
    </article>
  )
}

export function NewsContent({ tradeShows, stories }: NewsContentProps) {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-muted/30 py-14 md:py-18 lg:py-20">
        <div className="container relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h1 className="type-page-heading text-secondary">News &amp; Events</h1>
          <p className="type-body mx-auto mt-5 max-w-3xl text-muted-foreground">
            Explore the latest stories from Glacier Fresh and find out where to meet our team next.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16 lg:py-20" aria-labelledby="trade-shows-heading">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="trade-shows-heading" className="type-page-subheading text-secondary">
              Upcoming Trade Shows
            </h2>
            <p className="type-body mt-3 text-muted-foreground">
              Connect with Glacier Fresh at upcoming industry events.
            </p>
          </div>

          {tradeShows.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:mt-10">
              {tradeShows.map((tradeShow) => (
                <TradeShowCard key={tradeShow.id} tradeShow={tradeShow} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-14 md:py-16 lg:py-20" aria-labelledby="stories-heading">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="stories-heading" className="type-page-subheading text-secondary">
              News &amp; Stories
            </h2>
            <p className="type-body mt-3 text-muted-foreground">
              Company updates, partnerships, and stories from our community.
            </p>
          </div>

          {stories.length > 0 && (
            <div className="mt-8 space-y-8 lg:mt-10">
              {stories.map((story) => (
                <NewsStoryArticle key={story.id} story={story} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
