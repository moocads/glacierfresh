'use client'

import { useMemo } from 'react'
import {
  type WholeHouseCategory,
  type WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'
import {
  useCmsProducts,
  type CmsProduct,
  type CmsWholeHouseSpec,
} from '@/lib/use-cms-products'

const systemTypeLabels: Record<
  NonNullable<CmsWholeHouseSpec['system_type']>,
  string
> = {
  standard: 'Standard',
  heavy_duty: 'Heavy-Duty',
  two_stage_hd: '2-Stage HD',
  three_stage_hd: '3-Stage HD',
}

const lengthLabels: Record<NonNullable<CmsWholeHouseSpec['length']>, string> = {
  ten_inch: '10"',
  twenty_inch: '20"',
}

const diameterLabels: Record<
  NonNullable<CmsWholeHouseSpec['diameter']>,
  string
> = {
  inch_2_5: '2.5"',
  inch_4_5: '4.5"',
}

const connectionLabels: Record<
  NonNullable<CmsWholeHouseSpec['connection']>,
  string
> = {
  npt_3_4: '¾" NPT',
  npt_1: '1" NPT',
}

const capacityLabels: Record<
  NonNullable<CmsWholeHouseSpec['capacity']>,
  string
> = {
  m3_6: '3–6 months',
  m2_4: '2–4 months',
  m1_3: '1–3 months',
}

const tagFields = [
  ['Sediment', 'Sediment'],
  ['Rust', 'Rust'],
  ['Coarse_Sand', 'Coarse Sand'],
  ['Sand', 'Sand'],
  ['Fine_Sand', 'Fine Sand'],
] as const satisfies ReadonlyArray<readonly [keyof CmsWholeHouseSpec, string]>

const mediaLabels: Record<
  NonNullable<CmsWholeHouseSpec['filtration_media']>,
  string
> = {
  melt_blown: 'Melt-blown',
  pleated: 'Pleated · reusable',
  string_wound: 'String-wound',
  carbon_block: 'Carbon block',
  anti_scale: 'Anti-scale',
}

function labelFor<T extends string>(
  value: T | null | undefined,
  labels: Record<T, string>,
) {
  return value ? labels[value] : undefined
}

function mapCmsProduct(product: CmsProduct): {
  category: WholeHouseCategory
  product: WholeHouseProduct
  sortOrder: number
} | null {
  const spec = product.wholeHouseSpec
  const model = product.model?.trim()
  if (!spec || !model || product.categorySlug !== 'whole-house-solution') return null

  const media = labelFor(spec.filtration_media, mediaLabels)
  const name = product.name?.trim() || media || model
  const shared = {
    model,
    name,
    slug: product.slug,
    length: labelFor(spec.length, lengthLabels) ?? 'Not specified',
    diameter: labelFor(spec.diameter, diameterLabels) ?? 'Not specified',
    details: {
      imageSrc: product.imageSrc,
      galleryImages: product.galleryImages,
      imageAlt: product.imageAlt ?? name,
      description: product.description,
      specs: product.specs ?? [],
      accessories: product.accessories ?? [],
    },
  }

  if (spec.kind === 'housing') {
    return {
      category: 'housing',
      sortOrder: product.sortOrder ?? Number.MAX_SAFE_INTEGER,
      product: {
        ...shared,
        type: labelFor(spec.system_type, systemTypeLabels) ?? 'Not specified',
        connection:
          labelFor(spec.connection, connectionLabels) ?? 'Not specified',
        gauge:
          spec.pressure_gauge == null
            ? 'Not specified'
            : spec.pressure_gauge
              ? 'Yes'
              : 'No',
        color: spec.color
          ? spec.color.charAt(0).toUpperCase() + spec.color.slice(1)
          : 'Not specified',
      },
    }
  }

  return {
    category: 'cartridge',
    sortOrder: product.sortOrder ?? Number.MAX_SAFE_INTEGER,
    product: {
      ...shared,
      media: media ?? 'Not specified',
      micron: spec.micron_rating?.trim() || 'Not specified',
      capacity: labelFor(spec.capacity, capacityLabels),
      tags: tagFields
        .filter(([field]) => spec[field] === true)
        .map(([, label]) => label),
    },
  }
}

export function useWholeHouseCatalog() {
  const { products: cmsProducts, loading, error } = useCmsProducts()

  const products = useMemo(() => {
    const mapped = cmsProducts
      .filter((product) => product.isActive !== false)
      .map(mapCmsProduct)
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.product.model.localeCompare(b.product.model),
      )

    return {
      housing: mapped
        .filter((item) => item.category === 'housing')
        .map((item) => item.product),
      cartridge: mapped
        .filter((item) => item.category === 'cartridge')
        .map((item) => item.product),
    } satisfies Record<WholeHouseCategory, WholeHouseProduct[]>
  }, [cmsProducts])

  return { products, loading, error }
}
