import type { Metadata } from 'next'
import { ProductCategoryListing } from '@/components/product-category-listing'
import { WholeHousePage } from '@/components/whole-house/whole-house-page'

type ProductCategoryPageProps = {
  params: Promise<{
    categorySlug: string
  }>
}

export async function generateMetadata({
  params,
}: ProductCategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params

  if (categorySlug === 'whole-house-solution') {
    return {
      title: 'Whole House Water Filtration | Glacier Fresh',
      description:
        'Explore whole-home sediment, chlorine, and scale protection, from standard and heavy-duty housings to matching filter cartridges.',
    }
  }

  return {
    title: 'Product Category | Glacier Fresh',
    description: 'Browse Glacier Fresh products by category.',
  }
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { categorySlug } = await params

  if (categorySlug === 'whole-house-solution') {
    return <WholeHousePage />
  }

  return <ProductCategoryListing categorySlug={categorySlug} />
}
