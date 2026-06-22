'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const features = [
  {'Reliable Supply Chain':'Consistent inventory and scalable production to support your growth.'},
  {'Recurring Revenue Potential':'Replacement filters designed for ongoing demand.'},
  {'Partner-Focused Support':'Tools, training, and resources to help you succeed.'},
{'Installer-Friendly Design':'Products engineered to reduce installation time and complexity.'},
];

const certifications = [
  { name: 'FDA', label: 'FDA', icon: '/images/certificate/fda.png' },
  { name: 'FCC', label: 'FCC', icon: '/images/certificate/fcc.png' },
  { name: 'ISO', label: 'ISO', icon: '/images/certificate/iso.png' },
  { name: 'SGS', label: 'SGS', icon: '/images/certificate/sgs.png' },
]

const certificationDetails = [
  {
    name: 'Canadian Water Quality Association',
    icon: '/images/certificate/canada-water-quality-association.png',
    description: 'Canadian Water Quality Association, Industry trade association member',
  },
  {
    name: 'Outdoor Industry Association',
    icon: '/images/certificate/outdoor-industry-association.png',
    description: 'Outdoor industry Association, Outdoor recreation trade member',
  },
  {
    name: 'NSF',
    icon: '/images/certificate/nsf-certificate.png',
    description: 'NSF/ANSI 42·53·58·372 Certified since 2016 by NSF International',
  },
  {
    name: 'IAPMO',
    icon: '/images/certificate/iapmo.png',
    description: 'IAPMO R&T listed, North American plumbing & safety compliance',
  },
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
            <h1 className="text-3xl font-heavy md:text-5xl">
              <span className="text-primary ">Why Choose</span>
              <br />
              <span className="text-secondary">Glacier </span>
              <span className="text-primary">Fresh</span>
            </h1>

            <p className="mt-6 text-muted-foreground">
              Built to Support Your Business
            </p>

            {/* Features List */}
            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={Object.keys(feature)[0]}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50">
                    <div className="h-3.5 w-3.5 rounded-full bg-primary-100" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-primary text-xl">{Object.keys(feature)[0]}</span>
                    {/* <span className="font-medium text-secondary">{Object.values(feature)[0]}</span> */}
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Certifications */}
            <div className="mt-10 flex flex-wrap items-start justify-start gap-4">
              {certifications.map((cert) => (
                <Image
                  key={cert.name}
                  className="flex w-20 items-start justify-center rounded-lg"
                  src={cert.icon}
                  alt={cert.name}
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 rounded-lg bg-primary-50/50 p-6 lg:mt-16 lg:p-10">
          <p className="mx-auto max-w-4xl text-center text-sm leading-relaxed text-primary lg:text-base">
            Every Glacier Fresh filter is tested in our NSF-certified lab and must pass 17 quality
            checks before it ships. Our commitment to water safety has earned NSF/ANSI &amp; IAPMO
            certifications
          </p>

          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4 lg:mt-10 lg:gap-10">
            {certificationDetails.map((cert) => (
              <div key={cert.name} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-full items-center justify-center">
                  <div className="bg-white rounded-lg p-2 border border-primary-100">
                  <Image
                    src={cert.icon}
                    alt={cert.name}
                    width={160}
                    height={64}
                    className="max-h-14 w-auto object-contain"
                  />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-secondary md:text-sm">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
