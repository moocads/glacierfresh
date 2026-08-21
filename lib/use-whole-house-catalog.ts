'use client'

import { useMemo } from 'react'
import {
  type WholeHouseCategory,
  type WholeHouseProduct,
  type CartridgeSpecification,
} from '@/lib/whole-house-catalog-data'
import {
  useCmsProducts,
  type CmsCartridgeVariant,
  type CmsProduct,
  type CmsWholeHouseSpec,
} from '@/lib/use-cms-products'
import { getCartridgeSpecifications } from '@/lib/whole-house-cartridge-specifications'

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

const micronRatingLabels: Record<
  NonNullable<CmsCartridgeVariant['micron_rating']>,
  string
> = {
  micron_20: '20 Micron',
  micron_5: '5 Micron',
  micron_1: '1 Micron',
  not_rated: 'Not rated',
}

const replacementIntervalLabels: Record<
  NonNullable<CmsCartridgeVariant['replacement_interval']>,
  string
> = {
  m1_3: '1–3 months',
  m2_4: '2–4 months',
  m3_6: '3–6 months',
  m6_12: '6–12 months',
  m12_24: '12–24 months',
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

function numberValue(value: number | string | null | undefined) {
  if (value == null || value === '') return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/0+$/, '')
}

function mapCmsCartridgeSpecifications(
  variants: CmsCartridgeVariant[] | null | undefined,
  baseModel: string,
  size: string,
): CartridgeSpecification[] {
  if (!variants?.length) return getCartridgeSpecifications(baseModel)

  return variants
    .filter((variant) => variant.isActive !== false)
    .sort(
      (a, b) =>
        (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .flatMap((variant) => {
      const micronRating = labelFor(variant.micron_rating, micronRatingLabels)
      const flowRateGpm = numberValue(variant.flow_rate_gpm)
      const flowRateLpm = numberValue(variant.flow_rate_lpm)
      const pressurePsi = numberValue(variant.pressure_psi)
      const pressureBar = numberValue(variant.pressure_bar)
      const capacity = labelFor(
        variant.replacement_interval,
        replacementIntervalLabels,
      )

      if (
        !micronRating ||
        flowRateGpm == null ||
        flowRateLpm == null ||
        pressurePsi == null ||
        pressureBar == null ||
        !capacity
      ) {
        return []
      }

      return [
        {
          micronRating,
          size,
          model: variant.display_model?.trim() || baseModel,
          flowRate: `${formatNumber(flowRateGpm)} gpm @ ${formatNumber(pressurePsi)} psi (${formatNumber(flowRateLpm)} Lpm @ ${formatNumber(pressureBar)} bar)`,
          capacity,
        },
      ]
    })
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
  const length = labelFor(spec.length, lengthLabels) ?? 'Not specified'
  const diameter = labelFor(spec.diameter, diameterLabels) ?? 'Not specified'
  const shared = {
    model,
    name,
    slug: product.slug,
    length,
    diameter,
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
      specifications: mapCmsCartridgeSpecifications(
        spec.cartridge_variants,
        model,
        `${length} × ${diameter}`,
      ),
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
