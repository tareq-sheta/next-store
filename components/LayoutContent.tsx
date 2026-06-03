"use client"
import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { usePathname } from 'next/navigation';




export default function LayoutContent({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  )
}