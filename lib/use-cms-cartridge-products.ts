'use client'

import { useEffect, useState } from 'react'

export type CmsMedia = {
  alternativeText?: string | null
  url?: string
  formats?: {
    large?: { url: string }
    medium?: { url: string }
    small?: { url: string }
    thumbnail?: { url: string }
  }
}

export type CmsCartridgeSize = {
  id?: number
  name?: string | null
  sizeCode?: string | null
  lengthInches?: number | string | null
  diameterInches?: number | string | null
  isActive?: boolean | null
}

export type CmsMicronRating = {
  id?: number
  name?: string | null
  code?: string | null
  value?: number | string | null
  sortOrder?: number | null
  isActive?: boolean | null
}

export type CmsFiltrationCapability = {
  id?: number
  name?: string | null
  code?: string | null
  sortOrder?: number | null
  isActive?: boolean | null
}

export type CmsMicronConfiguration = {
  id?: number
  micronRating?: CmsMicronRating | null
  displayModel?: string | null
  flowRateGpm?: number | string | null
  flowRateLpm?: number | string | null
  testPressurePsi?: number | string | null
  testPressureBar?: number | string | null
  capacityMinMonths?: number | null
  capacityMaxMonths?: number | null
  filtrationEfficiencyLevel?: number | null
  initialPressureDropLevel?: number | null
  filtrationCapabilities?: CmsFiltrationCapability[] | null
  sortOrder?: number | null
  isActive?: boolean | null
}

export type CmsCartridgeSizeVariant = {
  id?: number
  size?: CmsCartridgeSize | null
  featureImage?: CmsMedia | null
  galleryImages?: CmsMedia[] | null
  micronConfigurations?: CmsMicronConfiguration[] | null
  sortOrder?: number | null
  isActive?: boolean | null
}

export type CmsCartridgeProduct = {
  id: number
  name?: string | null
  slug?: string | null
  description?: string | null
  category?: { slug?: string | null } | null
  commonSpecifications?: {
    benefits?: unknown[] | null
    filtrationMedia?: string | null
    pressureRange?: string | null
    temperatureRange?: string | null
  } | null
  sizeVariants?: CmsCartridgeSizeVariant[] | null
  sortOrder?: number | null
  isActive?: boolean | null
}

type CmsCartridgeProductsResponse = {
  data: CmsCartridgeProduct[]
}

export function useCmsCartridgeProducts() {
  const [products, setProducts] = useState<CmsCartridgeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/cartridge-products')
        if (!res.ok) {
          throw new Error(`Cartridge Products API returned ${res.status}`)
        }
        const json = (await res.json()) as CmsCartridgeProductsResponse
        if (!Array.isArray(json.data)) {
          throw new Error('Cartridge Products API returned invalid data')
        }
        if (!cancelled) setProducts(json.data)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load cartridge products from Strapi',
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
