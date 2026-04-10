'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import MagneticWrapper from '@/components/ui/MagneticWrapper'
import SketchButton from '@/components/ui/SketchButton'

const HEADING_WORDS = ['create', 'something']

interface Props {
  title?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export default function CommissionCta({
  body,
  ctaLabel = 'Get in Touch',
  ctaHref = '/about#contact',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative overflow-hidden px-8 md:px-16 py-28 md:py-36">
      {/* Soft peach radial glow */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 80% at 50% 50%, hsl(var(--peach) / 0.07), transparent 70%)' }}
      />

      <div ref={ref} className="relative max-w-2xl mx-auto text-center">

        {/* Label */}
        <div className="overflow-hidden mb-7">
          <motion.p
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="section-label inline-block"
          >
            Work Together
          </motion.p>
        </div>

        {/* Heading with stagger word reveal */}
        <h2 className="font-black text-4xl md:text-5xl text-foreground leading-[1.12] tracking-tight mb-5">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s{' '}
              {HEADING_WORDS.map((w, i) => (
                <motion.span
                  key={w}
                  className="inline-block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.12 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}&nbsp;
                </motion.span>
              ))}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.em
              className="block"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              worth remembering.
            </motion.em>
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.38 }}
          className="text-muted text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto"
        >
          {body || 'Open for commissions and freelance animation work. From short clips to full productions — reach out and let\'s bring your story to life.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.46 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticWrapper>
            <SketchButton href={ctaHref ?? '/about#contact'} size="lg">{ctaLabel ?? 'Get in Touch'}</SketchButton>
          </MagneticWrapper>
          <MagneticWrapper>
            <SketchButton href="/services" variant="outline" size="lg">View Services</SketchButton>
          </MagneticWrapper>
        </motion.div>
      </div>
    </section>
  )
}
