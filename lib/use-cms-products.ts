'use client'

import { useEffect, useState } from 'react'
import { slugifyProduct } from '@/lib/products-catalog-data'

export type CmsProduct = {
  id: number
  name?: string
  slug: string
  title: string
  model?: string
  description?: string
  imageSrc?: string
  galleryImages: string[]
  imageAlt?: string
  categorySlug?: string
  specs?: { label: string; value: string }[]
  accessories?: string[]
}

type CmsApiProduct = {
  id: number
  name?: string
  slug?: string
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
  gallery_images?: Array<{
    alternativeText?: string | null
    url?: string
    formats?: {
      large?: { url: string }
      medium?: { url: string }
      small?: { url: string }
      thumbnail?: { url: string }
    }
  }>
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

        const mapped: CmsProduct[] = json.data.map((p) => {
          const name = p.name?.trim() || undefined
          const model = p.model?.trim() || undefined
          const displayTitle = name ?? model ?? `Product ${p.id}`
          const featureImage =
            p.feature_image?.formats?.medium?.url ??
            p.feature_image?.formats?.small?.url ??
            p.feature_image?.url
          const galleryImages = [
            ...(featureImage ? [featureImage] : []),
            ...(p.gallery_images ?? [])
              .map(
                (image) =>
                  image.formats?.large?.url ??
                  image.formats?.medium?.url ??
                  image.formats?.small?.url ??
                  image.url,
              )
              .filter((url): url is string => Boolean(url)),
          ].filter((url, index, all) => all.indexOf(url) === index)

          return {
            id: p.id,
            name,
            slug: p.slug?.trim() || slugifyProduct(model ?? name ?? `product-${p.id}`),
            title: displayTitle,
            model,
            description: p.description,
            categorySlug: p.category?.slug,
            imageSrc: featureImage,
            galleryImages,
            imageAlt: p.feature_image?.alternativeText ?? displayTitle,
            specs: (p.specs ?? [])
              .filter((s) => s.label && s.value)
              .map((s) => ({ label: s.label!, value: s.value! })),
            accessories: (p.accessories ?? [])
              .map((a) => a.Value?.trim())
              .filter((value): value is string => Boolean(value)),
          }
        })

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
