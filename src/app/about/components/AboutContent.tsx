'use client'

import { useEffect, useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { r2url } from '@/lib/r2'
import type { ArtistInfo } from '@/types'
import FadeIn from '@/components/FadeIn'

function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
      <div className="w-40 h-40 md:w-52 md:h-52 skeleton shrink-0" />
      <div className="flex-1 space-y-3 pt-2">
        <div className="h-7 w-56 skeleton" />
        <div className="h-4 w-32 skeleton" />
        <div className="h-4 w-full skeleton mt-4" />
        <div className="h-4 w-5/6 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
      </div>
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const EASE = [0.16, 1, 0.3, 1] as const

export default function AboutContent() {
  const [info, setInfo] = useState<ArtistInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/artist')
      .then((r) => (r.ok ? r.json() as Promise<ArtistInfo> : Promise.reject()))
      .then((data) => { setInfo(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setFormError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const message = data.get('message') as string

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in all fields.')
      setSending(false)
      return
    }

    // Build a mailto link as fallback (for now — no backend mail route yet)
    const toEmail = info?.email || ''
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`
    setSending(false)
    setSent(true)
    form.reset()
  }

  const inputClass =
    'bg-surface text-foreground placeholder:text-muted/60 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 w-full transition-shadow'

  return (
    <div className="space-y-20">
      {/* ── Profile ── */}
      {loading ? (
        <ProfileSkeleton />
      ) : info ? (
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            {/* Portrait */}
            {info.profile_picture ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="w-40 h-40 md:w-52 md:h-52 shrink-0 overflow-hidden bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r2url(info.profile_picture)}
                  alt={info.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-40 h-40 md:w-52 md:h-52 shrink-0 bg-surface flex items-center justify-center">
                <span className="text-muted/40 text-4xl">✦</span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 pt-1">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-black text-3xl tracking-tight text-foreground leading-tight"
              >
                {info.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
                className="text-sm text-primary font-semibold mt-1"
              >
                @{info.penname}
              </motion.p>

              {info.bio && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="mt-5 text-muted leading-relaxed max-w-xl whitespace-pre-line"
                >
                  {info.bio}
                </motion.p>
              )}

              {/* Socials & Resume row */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3, ease: EASE }}
                className="mt-6 flex flex-wrap items-center gap-4"
              >
                {info.instagram_url && (
                  <a
                    href={info.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <InstagramIcon />
                    <span>Instagram</span>
                  </a>
                )}
                {info.linkedin_url && (
                  <a
                    href={info.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </a>
                )}
                {info.resume_url && (
                  <a
                    href={r2url(info.resume_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Resume</span>
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </FadeIn>
      ) : (
        <p className="text-muted italic">Bio coming soon.</p>
      )}

      {/* ── Contact ── */}
      <section id="contact">
        <FadeIn>
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-2">Get in Touch</h2>
          <p className="text-muted text-sm mb-8 max-w-md">
            Interested in working together? Send a message below.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-secondary/10 text-secondary px-6 py-4 font-semibold text-sm"
            >
              Your email client should have opened with a pre-filled message. Thank you!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
              <input type="text" name="name" placeholder="Your name" className={inputClass} required />
              <input type="email" name="email" placeholder="Your email" className={inputClass} required />
              <textarea name="message" rows={5} placeholder="Your message" className={`${inputClass} resize-none`} required />
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <button
                type="submit"
                disabled={sending}
                className="self-start bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/85 transition-all duration-150 disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </FadeIn>
      </section>
    </div>
  )
}
