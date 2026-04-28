'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function PartnerCTA() {
  return (
    <section className="py-8 lg:py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[linear-gradient(145deg,var(--color-primary-200)_0%,var(--color-primary-200)_20%,var(--color-primary-500)_40%,var(--color-primary-800)_80%,var(--color-primary-800)_100%)]">
          <div className="relative grid items-center lg:grid-cols-3">
            {/* Left - Image Placeholder */}
            <div className="relative h-full lg:col-span-1">
              <div className="absolute bottom-0 left-30">
                  <div className="flex h-full items-end justify-center">
                    <Image src="/images/partner.png" alt="Glacier Fresh" width={300} height={300} />
                  </div>
            </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 text-center lg:col-span-2 lg:p-12 lg:text-left">
              <h1 className="font-heading text-2xl font-heavy text-white md:text-5xl">
                Built by Engineers. Installed by You.
              </h1>

              <p className="mt-4 text-sm text-white/80 lg:text-base">
                Become a certified Glacier Fresh installer and get wholesale access to 80+ filter SKUs, same-day fulfillment from US warehouses, and up to 35% margin on every job.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button
                  variant="outline"
                  className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-secondary"
                >
                  See Partner Benefits
                </Button>
                <Button className="rounded-full bg-secondary-800 text-white hover:bg-secondary-900">
                  Become a Partner
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
