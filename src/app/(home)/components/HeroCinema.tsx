'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SketchButton from '@/components/ui/SketchButton'
import { r2url } from '@/lib/r2'

interface Props {
  filmSrc: string
  filmTitle: string
}

export default function HeroCinema({ filmSrc, filmTitle }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-14">

      {/* Soft peach radial glow behind video */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 60%, hsl(var(--peach) / 0.09), transparent 70%)' }}
      />

      {/* ── Hero text — centered, parallax on scroll ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 text-center px-6 mb-10 md:mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight leading-none whitespace-nowrap"
        >
          Kristin Thaeler
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.6 }}
          className="mt-3 text-muted text-sm md:text-base tracking-wide"
        >
          Animator&nbsp;·&nbsp;Storyteller&nbsp;·&nbsp;@firresketches
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-7"
        >
          <SketchButton href="/films" size="md">View Films</SketchButton>
          <SketchButton href="/about#contact" variant="outline" size="md">Hire Me</SketchButton>
        </motion.div>
      </motion.div>

      {/* ── Featured video ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl px-4 md:px-8"
      >
        {/* Label */}
        <div className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-surface border border-b-0 border-border/40">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-muted">Featured</span>
          </div>
          <span className="text-[11px] text-muted font-medium">{filmTitle}</span>
        </div>

        {/* Video */}
        <div className="border border-t-0 border-border/40 rounded-b-xl overflow-hidden bg-surface">
          <video
            src={r2url(filmSrc)}
            controls
            playsInline
            className="w-full aspect-video object-cover"
          />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted/60">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-6 bg-linear-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}

