'use client'

import { useMemo } from 'react'
import {
  type CatalogCategory,
  type CatalogProduct,
  productCategories,
} from '@/lib/products-catalog-data'
import { useCmsCategories } from '@/lib/use-cms-categories'
import { useCmsProducts } from '@/lib/use-cms-products'

export type ProductWithDetails = CatalogProduct & {
  cmsId?: number
  specs?: { label: string; value: string }[]
  accessories?: string[]
}

export type CategoryWithProducts = Omit<CatalogCategory, 'products'> & {
  products: ProductWithDetails[]
}

export function useProductCatalog() {
  const { categories: cmsCategories } = useCmsCategories()
  const { products: cmsProducts, loading, error } = useCmsProducts()

  const categories = useMemo<CategoryWithProducts[]>(() => {
    if (cmsProducts.length === 0) {
      return productCategories
    }

    return cmsCategories
      .map((cmsCat) => {
        const products = cmsProducts
          .filter((p) => p.categorySlug === cmsCat.id)
          .map(
            (p): ProductWithDetails => ({
              cmsId: p.id,
              name: p.name,
              slug: p.slug,
              title: p.title,
              model: p.model,
              description: p.description,
              cta: 'Learn More',
              imageSrc: p.imageSrc ?? '/images/products.png',
              galleryImages: p.galleryImages.length
                ? p.galleryImages
                : [p.imageSrc ?? '/images/products.png'],
              imageAlt: p.imageAlt ?? p.title,
              objectPosition: 'center',
              specs: p.specs,
              accessories: p.accessories,
            }),
          )

        return {
          id: cmsCat.id,
          title: cmsCat.title,
          navLabel: cmsCat.title,
          products,
        }
      })
      .filter((cat) => cat.products.length > 0)
  }, [cmsCategories, cmsProducts])

  return { categories, loading, error }
}
