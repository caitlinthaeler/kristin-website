'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'

const CARDS = [
  {
    href: '/animations',
    label: 'Animations',
    sub: 'Clips · GIFs · Animatics',
    image: '/ui/animations-button.png',
    span: 'col-span-2 md:col-span-2 row-span-2',
    spotlightColor: 'rgba(220, 130, 80, 0.14)',
  },
  {
    href: '/films',
    label: 'Films',
    sub: 'Short films',
    image: '/ui/films-button.png',
    span: 'col-span-1',
    spotlightColor: 'rgba(60, 165, 155, 0.12)',
  },
  {
    href: '/personal',
    label: 'Personal',
    sub: 'Drawings & more',
    image: '/ui/life-drawings-button.jpeg',
    span: 'col-span-1',
    spotlightColor: 'rgba(220, 150, 110, 0.12)',
  },
]

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

function TiltCard({ children, className }: TiltCardProps) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springConfig = { stiffness: 200, damping: 22, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const rotateY = useTransform(springX, [0, 1], ['-6deg', '6deg'])
  const rotateX = useTransform(springY, [0, 1], ['5deg', '-5deg'])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }
  function onMouseLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

export default function PortfolioGrid() {
  return (
    <section className="px-4 md:px-16 py-20" style={{ perspective: '1200px' }}>
      <div className="overflow-hidden mb-6">
        <motion.p
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="section-label"
        >
          Explore the Portfolio
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[240px] gap-2.5">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={card.span}
          >
            <TiltCard className="w-full h-full">
              <SpotlightCard
                className="group relative block w-full h-full rounded-xl overflow-hidden cursor-pointer"
                spotlightColor={card.spotlightColor}
              >
                <Link href={card.href} className="block w-full h-full">
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-linear-to-t from-bark/80 via-bark/15 to-transparent" />

                  {/* Label — slides up on hover */}
                  <div className="absolute bottom-0 left-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow">
                      {card.label}
                    </p>
                    <p className="text-[11px] text-white/60 mt-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">{card.sub}</p>
                  </div>

                  {/* Arrow badge */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                </Link>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
