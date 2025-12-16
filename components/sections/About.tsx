'use client'

import { motion } from 'framer-motion'
import { personalInfo } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <div>
            <SectionHeader label="ABOUT" title="The person behind the code." />

            <div className="space-y-6 text-foreground text-lg leading-relaxed">
              {personalInfo.bio.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-foreground"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-3 text-sm"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-foreground">{personalInfo.status}</span>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 backdrop-blur-3xl" />
            <div className="absolute inset-8 rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-8xl mb-6"
                >
                  👨‍💻
                </motion.div>
                <div className="font-mono text-foreground text-sm space-y-1">
                  <p>
                    <span className="text-accent-blue">location</span>: &quot;{personalInfo.location}&quot;
                  </p>
                  <p>
                    <span className="text-accent-purple">focus</span>: &quot;{personalInfo.title}&quot;
                  </p>
                  <p>
                    <span className="text-green-400">status</span>: &quot;Building&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
