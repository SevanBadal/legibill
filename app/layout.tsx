import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from './nav';
import { Suspense } from 'react';
import Loading from './loading';
import ClientProvider from './ClientProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LegiBill',
  description: 'Navigate your local legislation',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <Nav />
        </ClientProvider>
        <div className='p-4 bg-gray-200 min-h-screen'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>

      </body>
    </html>
  )
}
