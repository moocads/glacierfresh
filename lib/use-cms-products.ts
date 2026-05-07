'use client'

import { useEffect, useState } from 'react'

export type CmsProduct = {
  id: number
  title: string
  model?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  categorySlug?: string
  specs?: { label: string; value: string }[]
  accessories?: string[]
}

type CmsApiProduct = {
  id: number
  model?: string
  description?: string
  category?: {
    slug?: string
  }
  feature_image?: {
    alternativeText?: string | null
    url?: string
    formats?: {
      medium?: { url: string }
      small?: { url: string }
      thumbnail?: { url: string }
    }
  }
  specs?: Array<{
    label?: string
    value?: string
  }>
  accessories?: Array<{
    Value?: string
  }>
}

type CmsProductsResponse = {
  data: CmsApiProduct[]
}

export function useCmsProducts() {
  const [products, setProducts] = useState<CmsProduct[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) return
        const json = (await res.json()) as CmsProductsResponse
        if (!Array.isArray(json.data)) return
        if (cancelled) return

        const mapped: CmsProduct[] = json.data.map((p) => ({
          id: p.id,
          title: p.model ?? `Product ${p.id}`,
          model: p.model,
          description: p.description,
          categorySlug: p.category?.slug,
          imageSrc:
            p.feature_image?.formats?.medium?.url ??
            p.feature_image?.formats?.small?.url ??
            p.feature_image?.url,
          imageAlt: p.feature_image?.alternativeText ?? p.model ?? `Product ${p.id}`,
          specs: (p.specs ?? [])
            .filter((s) => s.label && s.value)
            .map((s) => ({ label: s.label!, value: s.value! })),
          accessories: (p.accessories ?? [])
            .map((a) => a.Value?.trim())
            .filter((value): value is string => Boolean(value)),
        }))

        setProducts(mapped)
      } catch {
        // Keep local product fallback in UI components.
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { products }
}

