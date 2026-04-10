'use client'

// Adapted from reactbits.dev/text-animations/decrypted-text
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz·•—∙◦'

interface Props {
  text: string
  speed?: number          // ms between reveals
  maxIterations?: number
  className?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover'
}

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  className = '',
  encryptedClassName = '',
  animateOn = 'view',
}: Props) {
  const [displayed, setDisplayed] = useState<string[]>(() => text.split(''))
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px 0px' })
  const iterRef = useRef<Map<number, number>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startDecrypt() {
    if (revealed) return
    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => {
        const next = [...prev]
        let allDone = true
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') { next[i] = ' '; continue }
          const iters = (iterRef.current.get(i) ?? 0) + 1
          iterRef.current.set(i, iters)
          if (iters >= maxIterations) {
            next[i] = text[i]
          } else {
            next[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
            allDone = false
          }
        }
        if (allDone) {
          clearInterval(intervalRef.current!)
          setRevealed(true)
        }
        return next
      })
    }, speed)
  }

  useEffect(() => {
    if (animateOn === 'view' && inView) startDecrypt()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={() => { if (animateOn === 'hover') { iterRef.current.clear(); startDecrypt() } }}
      aria-label={text}
    >
      {displayed.map((char, i) => (
        <span
          key={i}
          aria-hidden
          className={char !== text[i] ? encryptedClassName : ''}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
