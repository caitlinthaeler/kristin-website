'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import styles from './customStyles/GlowButton.module.css'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'ember' | 'ghost'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = 'ember',
  className = '',
  size = 'md',
}: Props) {
  const sizeClass = { sm: styles.sm, md: styles.md, lg: styles.lg }[size]
  const variantClass = variant === 'ghost' ? styles.ghost : styles.ember

  const inner = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
    >
      <span className={styles.shimmer} />
      <span className={styles.content}>{children}</span>
    </motion.span>
  )

  if (href) {
    return <a href={href} className={styles.anchor}>{inner}</a>
  }
  return <button onClick={onClick} className={styles.anchor}>{inner}</button>
}
