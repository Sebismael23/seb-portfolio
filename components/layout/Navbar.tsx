'use client'

import { motion } from 'framer-motion'
import { navItems } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 md:py-6 transition-all duration-300',
        scrolled && 'backdrop-blur-lg border-b border-border bg-background/95'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.a
          href="/"
          className="text-xl font-bold tracking-tight"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-foreground">Seb</span>
          <span className="text-accent-blue">.</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={isHomePage ? item.href : `/${item.href}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="relative text-sm text-foreground hover:text-accent-blue transition-colors duration-300 group font-medium drop-shadow-sm"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-blue group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button className="text-foreground hover:text-accent-blue transition-colors drop-shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
