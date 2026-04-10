'use client'

// Adapted from reactbits.dev/text-animations/blur-text
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  text: string
  className?: string
  wordClassName?: string
  delay?: number       // stagger delay per word in seconds
  direction?: 'top' | 'bottom'
  once?: boolean
}

export default function BlurText({
  text,
  className = '',
  wordClassName = '',
  delay = 0.06,
  direction = 'top',
  once = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once, margin: '-40px 0px' })
  const words = text.split(' ')

  const yOffset = direction === 'top' ? -18 : 18

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: yOffset, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: i * delay, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
