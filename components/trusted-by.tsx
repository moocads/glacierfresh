'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const retailers = [
  { name: 'Amazon', logo: 'amazon', icon: '/images/partners/amazon.png', url: 'https://www.amazon.com' },
  { name: 'The Home Depot', logo: 'home-depot', icon: '/images/partners/homedepot.png', url: 'https://www.homedepot.com' },
  { name: "Lowe's", logo: 'lowes', icon: '/images/partners/lowes.png', url: 'https://www. lowes.com' },
  { name: 'Ace Hardware', logo: 'ace', icon: '/images/partners/ace.png', url: 'https://www.acehardware.com/' },
  { name: 'Walmart', logo: 'walmart', icon: '/images/partners/walmart.png', url: 'https://www.walmart.com' },
  { name: 'Home Hardware', logo: 'home-hardware', icon: '/images/partners/homehardware.png', url: 'https://www.homehardware.ca/en' },
  { name: 'Menards', logo: 'menards', icon: '/images/partners/menards.png', url: 'https://www.menards.com/' },
  { name: 'Do It Best', logo: 'do-it-best', icon: '/images/partners/doitbest.png', url: 'https://www.doitbest.com/' },
]

export function TrustedBy() {
  return (
    <section className="bg-muted py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-2 flex justify-center">
            <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
              <path
                d="M6 0 C6 0 0 7 0 11 C0 15 2.7 18 6 18 C9.3 18 12 15 12 11 C12 7 6 0 6 0Z"
                fill="#306FCB"
                fillOpacity="0.4"
              />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            <span className="text-secondary">Trusted </span>
            <span className="text-primary">by North America&apos;s</span>
          </h2>
          <p className="font-heading text-2xl font-bold text-secondary md:text-3xl">
            Leading Retailers
          </p>
        </motion.div>

        {/* Retailer Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-4 xl:grid-cols-8"
        >
          {retailers.map((retailer) => (
            <div
              key={retailer.name}
              className="flex h-24 w-full max-w-40 items-center justify-center transition-all"
            >
              <Image src={retailer.icon} alt={retailer.name} width={150} height={100} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
