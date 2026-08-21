'use client'

import { useEffect, useState } from 'react'

type CmsImage = {
  url?: string
  alternativeText?: string | null
  formats?: {
    large?: { url: string }
    medium?: { url: string }
    small?: { url: string }
  }
}

type CmsHomeCategorySectionApiItem = {
  id: number
  documentId?: string
  title?: string
  subtitle?: string | null
  description?: string | null
  backgroundImage?: CmsImage | null
  ctaLabel?: string | null
  ctaHref?: string | null
  sortOrder?: number | null
  isVisible?: boolean | null
  category?: {
    slug?: string | null
  } | null
}

type CmsHomeCategorySectionsResponse = {
  data?: CmsHomeCategorySectionApiItem[]
}

export type CmsHomeCategorySection = {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  imageAlt: string
  ctaLabel?: string
  ctaHref?: string
  sortOrder: number
}

export function useCmsHomeCategorySections() {
  const [sections, setSections] = useState<CmsHomeCategorySection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/home-category-sections')
        if (!response.ok) {
          throw new Error(`Home category sections API returned ${response.status}`)
        }

        const json = (await response.json()) as CmsHomeCategorySectionsResponse
        if (!Array.isArray(json.data)) {
          throw new Error('Home category sections API returned invalid data')
        }

        if (cancelled) return

        const mapped = json.data
          .filter((item) => item.isVisible !== false && item.title?.trim())
          .map((item) => {
            const title = item.title!.trim()
            const image =
              item.backgroundImage?.formats?.large?.url ??
              item.backgroundImage?.formats?.medium?.url ??
              item.backgroundImage?.formats?.small?.url ??
              item.backgroundImage?.url
            const categoryHref = item.category?.slug
              ? `/products/${item.category.slug}`
              : undefined

            return {
              id: item.documentId ?? String(item.id),
              title,
              subtitle: item.subtitle?.trim() || undefined,
              description: item.description?.trim() || undefined,
              image,
              imageAlt: item.backgroundImage?.alternativeText?.trim() || title,
              ctaLabel: item.ctaLabel?.trim() || undefined,
              ctaHref: item.ctaHref?.trim() || categoryHref,
              sortOrder: item.sortOrder ?? Number.MAX_SAFE_INTEGER,
            }
          })
          .sort((a, b) => a.sortOrder - b.sortOrder)

        setSections(mapped)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load home category sections from CMS',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { sections, loading, error }
}
