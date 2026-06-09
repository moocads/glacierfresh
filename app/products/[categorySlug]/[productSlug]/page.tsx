import type { Metadata } from 'next'
import { ProductDetailContent } from '@/components/product-detail-content'

export const metadata: Metadata = {
  title: 'Product Detail | Glacier Fresh',
  description: 'View Glacier Fresh product details, specifications, and accessories.',
}

type ProductDetailPageProps = {
  params: Promise<{
    categorySlug: string
    productSlug: string
  }>
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { categorySlug, productSlug } = await params

  return (
    <ProductDetailContent
      categorySlug={categorySlug}
      productSlug={productSlug}
    />
  )
}
