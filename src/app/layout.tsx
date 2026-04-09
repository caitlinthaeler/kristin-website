import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Kristin Thaeler — Animation Portfolio',
  description: 'Animation portfolio of Kristin Thaeler (firresketches) — films, animations, and art.',
  metadataBase: new URL('https://kristinthaeler.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
