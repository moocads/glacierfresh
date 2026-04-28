'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const features = [
  'User-obsessed discovery',
  'Long-term R&D commitment',
  'Data-driven rigor',
  'Prototype-driven obsession',
]

const certifications = [
  { name: 'FDA', label: 'FDA', icon: '/images/certificate/fda.png' },
  { name: 'FCC', label: 'FCC', icon: '/images/certificate/fcc.png' },
  { name: 'ISO', label: 'ISO', icon: '/images/certificate/iso.png' },
  { name: 'NSF', label: 'NSF', icon: '/images/certificate/nsf.png' },
  { name: 'IAPMO', label: 'IAPMO', icon: '/images/certificate/iapmo.png' },
  { name: 'SGS', label: 'SGS', icon: '/images/certificate/sgs.png' },
]

export function WhyChoose() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left - Water Drop Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="relative h-[400px] w-[300px] lg:h-[500px] lg:w-[350px]">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-[22px] z-0 bg-primary-100 lg:inset-[28px]"
                animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.85, 0.45, 0.85] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  maskImage: "url('/images/water-drop.svg')",
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center',
                  WebkitMaskImage: "url('/images/water-drop.svg')",
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 bg-primary-50"
                animate={{ scale: [0.9, 1.08, 0.9], opacity: [0, 0.75, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  maskImage: "url('/images/water-drop.svg')",
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center',
                  WebkitMaskImage: "url('/images/water-drop.svg')",
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                }}
              />
         
              <div
                className="absolute inset-[44px] z-10 overflow-hidden lg:inset-[56px]"
                style={{
                  maskImage: "url('/images/water-drop.svg')",
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center',
                  WebkitMaskImage: "url('/images/water-drop.svg')",
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                }}
              >
                <Image
                  src="/images/why-banner.png"
                  alt="Glacier Fresh"
                  width={300}
                  height={400}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold md:text-5xl">
              <span className="text-primary font-heavy">Why Choose</span>
              <br />
              <span className="text-secondary">Glacier </span>
              <span className="text-primary">Fresh</span>
            </h1>

            <p className="mt-6 text-muted-foreground">
              In 2015, Charlie made a bold move, leaving his lucrative career to rebuild the water filtration industry through Apple&apos;s core principles
            </p>

            {/* Features List */}
            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50">
                    <div className="h-3.5 w-3.5 rounded-full bg-primary-100" />
                  </div>
                  <span className="font-medium text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Certifications */}
            <div className="mt-10 flex flex-wrap items-start justify-start gap-4">
              {certifications.map((cert) => (
                  <Image  className="flex w-20 items-start justify-center rounded-lg" src={cert.icon} alt={cert.name} width={80} height={80} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
