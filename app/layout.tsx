import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'

const publicSans = Public_Sans({ 
  subsets: ['latin'],
  variable: '--font-public-sans',
})

export const metadata: Metadata = {
  title: 'Saartheiv - FAQ | Ride Booking Service',
  description: 'Frequently asked questions about Saartheiv ride booking service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} font-sans`}>{children}</body>
    </html>
  )
}