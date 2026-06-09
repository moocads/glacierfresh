import type { Metadata } from 'next'
import { ProductCategoryListing } from '@/components/product-category-listing'

export const metadata: Metadata = {
  title: 'Product Category | Glacier Fresh',
  description: 'Browse Glacier Fresh products by category.',
}

type ProductCategoryPageProps = {
  params: Promise<{
    categorySlug: string
  }>
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { categorySlug } = await params

  return <ProductCategoryListing categorySlug={categorySlug} />
}
