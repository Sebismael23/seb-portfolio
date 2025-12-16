'use client'

import { motion } from 'framer-motion'
import { personalInfo } from '@/lib/data'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 px-6 md:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-foreground"
          >
            © {currentYear} {personalInfo.name}. All rights reserved.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-900 dark:text-gray-100"
          >
            Built with passion & caffeine
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
