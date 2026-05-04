import type { Metadata } from 'next'
import { ProductsCatalog } from '@/components/products-catalog'

export const metadata: Metadata = {
  title: 'Products | Glacier Fresh',
  description:
    'Browse Glacier Fresh whole house, under sink, and outdoor water filtration solutions.',
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <ProductsCatalog />
    </main>
  )
}
