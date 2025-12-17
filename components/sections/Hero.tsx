'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { personalInfo } from '@/lib/data'
import Button from '@/components/ui/Button'
import GeometricPortrait from '@/components/portrait/GeometricPortrait'

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 md:px-8">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, #8b5cf6 0%, transparent 50%)
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-100 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div
        className="absolute inset-0 opacity-100 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-accent-blue text-sm tracking-widest mb-4 font-mono"
            >
              {personalInfo.title.toUpperCase()}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 text-foreground"
            >
              {personalInfo.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-text-muted mb-8 max-w-md mx-auto lg:mx-0"
            >
              {personalInfo.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <Button href="#work" variant="primary">
                View Work
              </Button>
              <Button href="#contact" variant="secondary">
                Contact
              </Button>
            </motion.div>
          </div>

          {/* Geometric Portrait */}
          <div className="flex-shrink-0">
            <GeometricPortrait
              width={300}
              height={420}
              revealRadius={70}
              imageSrcLight="/images/sebPortfolio1.jpeg"
              imageSrcDark="/images/sebPortfolio2.jpeg"
              meshSrcLight="/images/sebPortfolio1geometrics.jpg"
              meshSrcDark="/images/sebPortfolio2geometrics.jpg"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
      >
        <span className="text-xs tracking-widest font-mono">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-text-muted to-transparent"
        />
      </motion.div>
    </section>
  )
}
