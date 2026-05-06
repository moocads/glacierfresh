import Link from 'next/link'
import Image from 'next/image'
import { productCategories } from '@/lib/products-catalog-data'
import { LinkedinIcon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-secondary py-12 text-secondary-foreground lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <Image src="/images/logo-white.png" alt="Glacier Fresh" width={200} height={100} />
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-secondary-100">
              Wholesale water filtration manufacturing for North America&apos;s retail and OEM partners. Operating as Ningbo Pureza Technology, LLC since 2016.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Products</h3>
            <ul className="mt-4 space-y-3">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products#${cat.id}`}
                    className="text-sm text-secondary-100 transition-colors hover:text-primary-300"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-secondary-100">
              <li> <Link href="mailto:wholesale@glacierfreshfilter.com">wholesale@glacierfreshfilter.com</Link></li>
              <li> <Link href="tel:19059406266">Phone: 1-905-940-6266</Link></li>
              <li> <Link href="tel:18775136266">Toll free: 1-877-513-6266 </Link></li>
              <li> <Link href="https://share.google/G1tUyaYyXuWHFwWCd">90 Allstate Pkwy, Suite 601, Markham, ON L3R 6H3</Link></li>
            </ul>
            <div className="mt-4">
              <Link href="https://www.linkedin.com/company/89897740/admin/page-posts/published/" target="_blank" rel="noopener noreferrer">
               <LinkedinIcon className="w-6 h-6 text-secondary-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-secondary-400 pt-8">
          <p className="text-center text-sm text-secondary-200">
            © {new Date().getFullYear()} Glacier Fresh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
