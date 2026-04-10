'use client'

import { motion } from 'framer-motion'
import FadeIn from '@/components/FadeIn'
import SketchButton from '@/components/ui/SketchButton'
import MagneticWrapper from '@/components/ui/MagneticWrapper'

interface Props {
  title?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export default function AboutTeaser({
  title,
  body,
  ctaLabel = 'Learn More',
  ctaHref = '/about',
}: Props) {

  const quote = title || 'Storytelling through movement —\neach frame a brushstroke.'
  const description = body || 'Kristin Thaeler is an animator and visual storyteller working under the name firresketches. Rooted in classical drawing and a love for expressive motion, her work explores character, emotion, and the quiet beauty of the in-between.'

  return (
    <section className="px-8 md:px-16 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_380px] gap-16 lg:gap-24 items-center">

        {/* Left — text */}
        <FadeIn direction="left">
          <div className="overflow-hidden mb-7">
            <motion.p
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="section-label"
            >
              About the Artist
            </motion.p>
          </div>

          <FadeIn clipReveal delay={0.1}>
            <blockquote className="font-extrabold italic text-3xl md:text-4xl lg:text-[2.8rem] text-foreground leading-[1.18] tracking-tight whitespace-pre-line">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </FadeIn>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-muted text-sm leading-relaxed max-w-md"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8"
          >
            <MagneticWrapper>
              <SketchButton href={ctaHref ?? '/about'} variant="outline" size="md">{ctaLabel ?? 'Learn More'}</SketchButton>
            </MagneticWrapper>
          </motion.div>
        </FadeIn>

        {/* Right — portrait placeholder */}
        <FadeIn direction="right" delay={0.15}>
          <div className="aspect-3/4 overflow-hidden bg-surface relative">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(145deg, hsl(var(--pearl)), hsl(var(--fog)))' }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: 'radial-gradient(circle at 40% 35%, hsl(var(--peach) / 0.18) 0%, transparent 60%)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
              <p className="section-label opacity-40">Portrait</p>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
