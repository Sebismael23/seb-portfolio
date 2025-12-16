'use client'

import { useState } from 'react'
import BootSequence from '@/components/boot/BootSequence'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false)

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
