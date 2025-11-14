import React from 'react'
import { Inter, Michroma } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import './matrix-styles.css'

const inter = Inter({ subsets: ['latin'] })
const michroma = Michroma({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-michroma'
})

export const metadata: Metadata = {
  title: 'yGa',
  description: 'Tecnologías al alcance',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (    
    <html lang="en">      
      <body className={`${inter.className} ${michroma.variable}`}>      
        {children}
      </body>
    </html>
  )
}
