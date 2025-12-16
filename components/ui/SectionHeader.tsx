'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label: string
  title: string
  className?: string
}

export default function SectionHeader({ label, title, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-16', className)}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-accent-blue text-sm tracking-widest mb-4 font-mono"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
      >
        {title}
      </motion.h2>
    </div>
  )
}
