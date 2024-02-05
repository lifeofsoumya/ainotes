import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from './ThemeProvider'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600']
})

export const metadata: Metadata = {
  title: 'AI chat application',
  description: 'Notetaking made fun with AI chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          <ThemeProvider attribute='class'>
            {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  )
}
