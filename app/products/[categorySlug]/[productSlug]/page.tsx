import type { Metadata } from 'next'
import { ProductDetailContent } from '@/components/product-detail-content'
import { WholeHouseProductDetail } from '@/components/whole-house/whole-house-product-detail'

type ProductDetailPageProps = {
  params: Promise<{
    categorySlug: string
    productSlug: string
  }>
  searchParams: Promise<{
    micron?: string | string[]
    size?: string | string[]
  }>
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params

  if (categorySlug === 'whole-house-solution') {
    return {
      title: 'Whole House Product | Glacier Fresh',
      description:
        'View Glacier Fresh whole-house product specifications and compatibility.',
    }
  }

  return {
    title: 'Product Detail | Glacier Fresh',
    description:
      'View Glacier Fresh product details, specifications, and accessories.',
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const { categorySlug, productSlug } = await params

  if (categorySlug === 'whole-house-solution') {
    const query = await searchParams
    return (
      <WholeHouseProductDetail
        productSlug={productSlug}
        selectedMicron={firstQueryValue(query.micron)}
        selectedSize={firstQueryValue(query.size)}
      />
    )
  }

  return (
    <ProductDetailContent
      categorySlug={categorySlug}
      productSlug={productSlug}
    />
  )
}
