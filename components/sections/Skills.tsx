'use client'

import { motion } from 'framer-motion'
import { skillsSorted } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import SkillBar from '@/components/ui/SkillBar'

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 px-6 md:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-surface-dark dark:from-surface-dark dark:via-surface-dark dark:to-surface-dark">
      {/* Gradient background for dark mode */}
      <div 
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 70% 30%, rgba(139, 92, 246, 0.1) -20%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 80%, rgba(59, 130, 246, 0.1) -20%, transparent 50%),
            linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,15,20,0.4) 50%, rgba(0,0,0,0) 100%)
          `,
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader label="CAPABILITIES" title="Tech Stack" />

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-background rounded-2xl border border-border overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-sm text-text-muted font-mono">skills.sh</span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-muted mb-6"
            >
              $ cat skills.json | sort --by-proficiency
            </motion.p>

            <div className="space-y-4">
              {skillsSorted.slice(0, 10).map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-green-400 mt-6"
            >
              ✓ All systems operational
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
