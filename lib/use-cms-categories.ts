'use client'

import { useEffect, useState } from 'react'
import { productCategories } from '@/lib/products-catalog-data'

export type CmsCategory = {
  id: string
  title: string
  slug: string
  menuImage?: string
  products?: { title: string; model?: string; description?: string }[]
}

type CmsApiCategory = {
  id: number
  Category_Name: string
  slug: string
  Menu_image?: {
    url: string
    formats?: {
      small?: { url: string }
      medium?: { url: string }
      thumbnail?: { url: string }
    }
  }
  products?: { model?: string; description?: string }[]
}

type CmsCategoriesResponse = {
  data: CmsApiCategory[]
}

export function useCmsCategories() {
  const fallbackCategories: CmsCategory[] = productCategories.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.id,
    menuImage: c.home?.menuImage ?? c.products[0]?.imageSrc,
    products: c.products.map((p) => ({
      title: p.title,
      model: p.model,
      description: p.description,
    })),
  }))

  const [categories, setCategories] = useState<CmsCategory[]>(fallbackCategories)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) return
        const json = (await res.json()) as CmsCategoriesResponse
        if (!Array.isArray(json.data) || json.data.length === 0) return

        if (cancelled) return

        const mapped: CmsCategory[] = json.data.map((c) => {
          const menuUrl =
            c.Menu_image?.formats?.medium?.url ??
            c.Menu_image?.formats?.small?.url ??
            c.Menu_image?.url

          return {
            id: c.slug,
            title: c.Category_Name,
            slug: c.slug,
            menuImage: menuUrl,
            products: c.products?.map((p) => ({
              title: p.model ?? '',
              model: p.model,
              description: p.description,
            })),
          }
        })

        setCategories(mapped)
      } catch {
        // ignore – non-critical enhancement
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { categories }
}

