import productsJson from '@/data/products.json'

/** Shape stored in `data/products.json` — edit that file to change categories and products. */
export type ProductJson = {
  productName: string
  productImage: string
  imageAlt?: string
  badges?: string[]
  model?: string
  bullets?: string[]
  description?: string
  cta?: string
  objectPosition?: 'left center' | 'right center' | 'center'
}

export type CategoryHomeJson = {
  subtitle?: string
  description?: string
  bannerImage: string
  hasOverlay?: boolean
  cta: string
  ctaHref?: string
}

export type CategoryJson = {
  id: string
  name: string
  navLabel?: string
  home?: CategoryHomeJson
  products: ProductJson[]
}

export type ProductsFileJson = {
  categories: CategoryJson[]
}

export type CatalogProduct = {
  badges?: string[]
  title: string
  model?: string
  bullets?: string[]
  description?: string
  cta?: string
  imageSrc: string
  imageAlt: string
  objectPosition: 'left center' | 'right center' | 'center'
}

export type CatalogCategory = {
  id: string
  title: string
  navLabel: string
  products: CatalogProduct[]
}

export type ProductCategoryId = string

const POSITIONS: readonly CatalogProduct['objectPosition'][] = [
  'left center',
  'right center',
  'center',
]

function normalizeObjectPosition(
  v: string | undefined,
): CatalogProduct['objectPosition'] {
  if (v && (POSITIONS as readonly string[]).includes(v)) {
    return v as CatalogProduct['objectPosition']
  }
  return 'center'
}

function mapProduct(p: ProductJson): CatalogProduct {
  return {
    title: p.productName,
    imageSrc: p.productImage,
    imageAlt: p.imageAlt ?? p.productName,
    badges: p.badges,
    model: p.model,
    bullets: p.bullets,
    description: p.description,
    cta: p.cta,
    objectPosition: normalizeObjectPosition(p.objectPosition),
  }
}

function mapCategory(c: CategoryJson): CatalogCategory {
  return {
    id: c.id,
    title: c.name,
    navLabel: c.navLabel ?? c.name,
    products: c.products.map(mapProduct),
  }
}

/** Normalized categories for catalog page, mega menu, and nav. */
export const productCategories: CatalogCategory[] = (
  productsJson as ProductsFileJson
).categories.map(mapCategory)

/** Homepage “Product Line” cards — driven by optional `home` on each category in JSON. */
export type HomeProductLineCard = {
  id: string
  title: string
  subtitle?: string
  description?: string
  cta: string
  ctaHref: string
  image: string
  hasOverlay: boolean
}

export function getHomeProductLineCards(): HomeProductLineCard[] {
  return (productsJson as ProductsFileJson).categories
    .filter((c): c is CategoryJson & { home: CategoryHomeJson } => Boolean(c.home))
    .map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: c.home!.subtitle,
      description: c.home!.description,
      cta: c.home!.cta,
      ctaHref: c.home!.ctaHref ?? `/products#${c.id}`,
      image: c.home!.bannerImage,
      hasOverlay: c.home!.hasOverlay ?? true,
    }))
}

/** Raw JSON (read-only) if you need the file shape elsewhere. */
export function getProductsJson(): ProductsFileJson {
  return productsJson as ProductsFileJson
}
