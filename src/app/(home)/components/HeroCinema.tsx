'use client'

import { motion } from 'framer-motion'
import { r2url } from '@/lib/r2'

interface Props {
  filmSrc: string
  filmTitle: string
}

export default function HeroCinema({ filmSrc, filmTitle }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-0 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-deep/80 to-deep pointer-events-none z-10" />

      {/* Floating title — top left */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-24 left-8 md:left-16 z-20 max-w-lg"
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-primary mb-3 font-semibold">
          Animation Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
          <span className="block text-fire">Kristin</span>
          <span className="block text-foreground">Thaeler</span>
        </h1>
        <p className="mt-4 text-silver text-base md:text-lg font-light tracking-wide">
          Animator · Storyteller · firresketches
        </p>
      </motion.div>

      {/* Cinematic video frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-6 md:mx-16 mb-0"
      >
        {/* Film label bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-void/80 backdrop-blur-sm border-t border-x border-veil/40 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">Featured Work</span>
          </div>
          <span className="text-[11px] text-silver font-medium">{filmTitle}</span>
        </div>

        {/* Video */}
        <div className="relative bg-void overflow-hidden rounded-b-lg border border-veil/40 border-t-0">
          <video
            src={r2url(filmSrc)}
            controls
            playsInline
            className="w-full aspect-video object-cover"
          />
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 right-8 z-20 flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] tracking-[0.2em] uppercase text-muted rotate-90 mb-1">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
