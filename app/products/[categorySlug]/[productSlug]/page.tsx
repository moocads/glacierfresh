import type { Metadata } from 'next'
import { ProductDetailContent } from '@/components/product-detail-content'
import { WholeHouseProductDetail } from '@/components/whole-house/whole-house-product-detail'

type ProductDetailPageProps = {
  params: Promise<{
    categorySlug: string
    productSlug: string
  }>
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
}: ProductDetailPageProps) {
  const { categorySlug, productSlug } = await params

  if (categorySlug === 'whole-house-solution') {
    return <WholeHouseProductDetail productSlug={productSlug} />
  }

  return (
    <ProductDetailContent
      categorySlug={categorySlug}
      productSlug={productSlug}
    />
  )
}
