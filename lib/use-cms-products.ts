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
  isActive?: boolean | null
  sortOrder?: number | null
  wholeHouseSpec?: CmsWholeHouseSpec | null
}

export type CmsWholeHouseSpec = {
  kind: 'housing' | 'cartridge'
  system_type?: 'standard' | 'heavy_duty' | 'two_stage_hd' | 'three_stage_hd' | null
  length?: 'ten_inch' | 'twenty_inch' | null
  diameter?: 'inch_2_5' | 'inch_4_5' | null
  connection?: 'npt_3_4' | 'npt_1' | null
  pressure_gauge?: boolean | null
  color?: 'white' | 'clear' | 'black' | 'blue' | null
  capacity?: 'm3_6' | 'm2_4' | 'm1_3' | null
  filtration_media?:
    | 'melt_blown'
    | 'pleated'
    | 'string_wound'
    | 'carbon_block'
    | 'anti_scale'
    | null
  micron_rating?: string | null
  Sediment?: boolean | null
  Rust?: boolean | null
  Coarse_Sand?: boolean | null
  Sand?: boolean | null
  Fine_Sand?: boolean | null
  cartridge_variants?: CmsCartridgeVariant[] | null
}

export type CmsCartridgeVariant = {
  id?: number
  micron_rating?: 'micron_20' | 'micron_5' | 'micron_1' | 'not_rated' | null
  display_model?: string | null
  flow_rate_gpm?: number | string | null
  flow_rate_lpm?: number | string | null
  pressure_psi?: number | string | null
  pressure_bar?: number | string | null
  replacement_interval?:
    | 'm1_3'
    | 'm2_4'
    | 'm3_6'
    | 'm6_12'
    | 'm12_24'
    | null
  sortOrder?: number | null
  isActive?: boolean | null
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
  isActive?: boolean | null
  sortOrder?: number | null
  whole_house_spec?: CmsWholeHouseSpec | null
}

type CmsProductsResponse = {
  data: CmsApiProduct[]
}

export function useCmsProducts() {
  const [products, setProducts] = useState<CmsProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error(`Products API returned ${res.status}`)
        const json = (await res.json()) as CmsProductsResponse
        if (!Array.isArray(json.data)) throw new Error('Products API returned invalid data')
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
            isActive: p.isActive,
            sortOrder: p.sortOrder,
            wholeHouseSpec: p.whole_house_spec,
          }
        })

        setProducts(mapped)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load products from Strapi',
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

  return { products, loading, error }
}
