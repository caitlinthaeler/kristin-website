'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
}

const sizeMap = {
  sm:  'px-4 py-1.5 text-xs',
  md:  'px-5 py-2 text-sm',
  lg:  'px-6 py-2.5 text-sm',
}

const variantMap = {
  solid:   'bg-primary text-primary-foreground hover:bg-primary/85',
  outline: 'border border-foreground/25 text-foreground hover:bg-surface hover:border-foreground/40',
  ghost:   'text-foreground/70 hover:text-foreground hover:bg-surface',
}

export default function SketchButton({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  className = '',
  type = 'button',
}: Props) {
  const cls = [
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 active:scale-95 cursor-pointer',
    sizeMap[size],
    variantMap[variant],
    className,
  ].filter(Boolean).join(' ')

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return (
    <button type={type} onClick={onClick} className={cls}>{children}</button>
  )
}

