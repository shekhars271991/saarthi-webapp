'use client';
import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'
import Head from 'next/head'

const publicSans = Public_Sans({ 
  subsets: ['latin'],
  variable: '--font-public-sans',
})


import { Toaster } from 'react-hot-toast';
import Chatbot from './components/Chatbot';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
            <head>
        <link rel="icon" href="/favicon.png" />
        {/* Optional: PNG or SVG favicons */}
        {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
      </head>
      <body className={`${publicSans.variable} font-sans`}>
        {children}
        <Chatbot />
        <Toaster />
      </body>
    </html>
  )
}
