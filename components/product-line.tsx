'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { getHomeProductLineCards } from '@/lib/products-catalog-data'

const products = getHomeProductLineCards()

export function ProductLine() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex justify-center">
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
              <path
                d="M10 0 C10 0 0 12 0 18 C0 24.627 4.477 30 10 30 C15.523 30 20 24.627 20 18 C20 12 10 0 10 0Z"
                fill="#306FCB"
                fillOpacity="0.3"
              />
            </svg>
          </div>
          <h2 className="font-heading text-3xl font-heavy text-primary md:text-4xl">
            Product Line
          </h2>
        </motion.div>

        {/* Product Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl ${
                product.image ? 'h-96' : 'h-96 bg-primary-50'
              }`}
            >
              {product.image ? (
                <>
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />

                  {/* Bottom-to-top gradient cover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-white/0" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h2 className="font-heading text-3xl font-bold text-white">
                      {product.title}
                    </h2>
                    {product.subtitle && (
                      <p className="mt-1 text-sm text-white/80">{product.subtitle}</p>
                    )}
                    {product.description && (
                      <p className="mt-1 text-sm text-white/70">{product.description}</p>
                    )}
                    {product.cta && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-fit rounded-full border-white bg-transparent text-white hover:bg-white hover:text-secondary"
                        asChild
                      >
                        <Link href={product.ctaHref}>{product.cta}</Link>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <h2 className="font-heading text-xl font-semibold text-primary">
                    {product.title}
                  </h2>
                  {product.subtitle && (
                    <p className="mt-2 text-sm text-muted-foreground">{product.subtitle}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
