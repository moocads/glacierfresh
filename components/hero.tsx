'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-20">

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-heavy text-primary md:text-5xl">
              From Glacier to your glass. 
            </h1>
            <h2 className="mt-2 font-heading text-3xl font-heavy text-secondary md:text-5xl ">
              Trusted by wholesalers, dealers, and installers.
            </h2>
            <h2 className="font-heading text-3xl font-heavy text-secondary md:text-5xl ">
               across North America. 
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              NSF-certified water filtration systems designed for consistent supply, easy installation, and long-term value.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="rounded-full bg-secondary px-6 py-3 text-secondary-foreground hover:bg-secondary-600">
                Get in Touch
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-secondary px-6 py-3 text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                Product Catalog
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Product Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full " style={{backgroundImage: "url('/images/water-drop.svg')", backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center'}}>
              {/* Main product image - Water filtration system */}
                <div className="flex h-full w-full items-center justify-center">
                  <Image src="/images/products.png" alt="Glacier Fresh" width={600} height={300} />
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
