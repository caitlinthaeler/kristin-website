'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const CARDS = [
  {
    href: '/animations',
    label: 'Animations',
    sub: 'Clips · GIFs · Animatics',
    image: '/ui/animations-button.png',
    span: 'md:col-span-2 md:row-span-2', // hero card
  },
  {
    href: '/films',
    label: 'Films',
    sub: 'Short films',
    image: '/ui/films-button.png',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    href: '/life-drawings',
    label: 'Life Drawings',
    sub: 'Figure work',
    image: '/ui/life-drawings-button.jpeg',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    href: '/about',
    label: 'About Me',
    sub: 'Bio · Contact · Resume',
    image: '/ui/about-me-button.jpeg',
    span: 'md:col-span-2 md:row-span-1', // wide bottom card
  },
]

export default function PortfolioGrid() {
  return (
    <section className="px-6 md:px-16 py-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold mb-6"
      >
        Explore the Portfolio
      </motion.p>

      {/* Asymmetric bento: 3 cols × auto rows */}
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] md:auto-rows-[240px] gap-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={card.span}
          >
            <Link
              href={card.href}
              className="group relative block w-full h-full overflow-hidden rounded-xl"
            >
              {/* bg image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent transition-opacity duration-300 group-hover:from-void/70" />
              {/* ember line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-xl md:text-2xl font-bold text-cream leading-tight">{card.label}</p>
                <p className="text-[11px] text-silver/80 mt-1 tracking-wide">{card.sub}</p>
              </div>

              {/* Arrow on hover */}
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
