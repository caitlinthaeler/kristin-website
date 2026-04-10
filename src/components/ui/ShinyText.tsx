'use client'

// Adapted from reactbits.dev/text-animations/shiny-text
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  text: string
  speed?: number
  className?: string
  /** base text color as CSS color string */
  color?: string
  /** shine highlight color */
  shineColor?: string
  spread?: number
  disabled?: boolean
}

export default function ShinyText({
  text,
  speed = 3,
  className = '',
  color = 'hsl(226 28% 88%)',
  shineColor = 'hsl(40 85% 70%)',
  spread = 110,
  disabled = false,
}: Props) {
  const progress = useMotionValue(0)
  const elapsed = useRef(0)
  const last = useRef<number | null>(null)

  useAnimationFrame((t) => {
    if (disabled) return
    if (last.current === null) { last.current = t; return }
    elapsed.current += t - last.current
    last.current = t
    progress.set(((elapsed.current / (speed * 1000)) % 1) * 100)
  })

  const bgPos = useTransform(progress, (p) => `${150 - p * 2}% center`)

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 38%, ${shineColor} 50%, ${color} 62%, ${color} 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundPosition: bgPos,
        display: 'inline-block',
      }}
    >
      {text}
    </motion.span>
  )
}
