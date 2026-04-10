'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Clips the element, revealing it by sliding up from underneath — truus-style text reveal */
  clipReveal?: boolean
  className?: string
  once?: boolean
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  clipReveal = false,
  className,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-50px 0px' })

  if (clipReveal) {
    return (
      <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
        <motion.div
          initial={{ y: '105%', opacity: 0 }}
          animate={inView ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    )
  }

  const offsets: Record<string, { x?: number; y?: number }> = {
    up:    { y: 32 },
    down:  { y: -32 },
    left:  { x: 36 },
    right: { x: -36 },
    none:  {},
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

