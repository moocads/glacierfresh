'use client'

import { useEffect, useState } from 'react'

export type CmsCategory = {
  id: string
  title: string
  slug: string
  menuImage?: string
  products?: { title: string }[]
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
  products?: { model?: string }[]
}

type CmsCategoriesResponse = {
  data: CmsApiCategory[]
}

export function useCmsCategories() {
  const [categories, setCategories] = useState<CmsCategory[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) return
        const json = (await res.json()) as CmsCategoriesResponse

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

