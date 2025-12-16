'use client'

import { motion } from 'framer-motion'
import { personalInfo } from '@/lib/data'
import Button from '@/components/ui/Button'

const socialLinks = [
  { name: 'LinkedIn', href: personalInfo.social.linkedin },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:bg-surface-dark dark:from-surface-dark dark:via-surface-dark dark:to-surface-dark">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-blue text-sm tracking-widest mb-4 font-mono"
        >
          CONTACT
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-foreground"
        >
          Let&apos;s build something.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-foreground mb-12"
        >
          Have a project in mind? I&apos;d love to hear about it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button
            href={`mailto:${personalInfo.email}`}
            variant="primary"
            size="lg"
            external
          >
            <span>Get in touch</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6 mt-12"
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-accent-blue transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
