'use client'

import { motion } from 'framer-motion'
import type { Skill } from '@/lib/data'

interface SkillBarProps {
  skill: Skill
  index: number
}

export default function SkillBar({ skill, index }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center gap-4"
    >
      <span className="w-24 text-text-muted text-sm">{skill.name}</span>
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          }}
        />
      </div>
      <span className="text-text-muted w-12 text-right text-sm">{skill.level}%</span>
    </motion.div>
  )
}
