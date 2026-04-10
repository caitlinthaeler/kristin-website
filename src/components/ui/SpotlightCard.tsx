'use client'

// Adapted from reactbits.dev/components/spotlight-card
import { useRef } from 'react'
import type { ReactNode } from 'react'
import styles from './customStyles/SpotlightCard.module.css'

interface Props {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 110, 40, 0.13)',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - rect.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - rect.top}px`)
    ref.current.style.setProperty('--spotlight', spotlightColor)
  }

  function handleMouseLeave() {
    ref.current?.style.removeProperty('--x')
    ref.current?.style.removeProperty('--y')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${styles.card} ${className}`}
    >
      {children}
    </div>
  )
}
