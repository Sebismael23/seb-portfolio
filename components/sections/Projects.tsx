'use client'

import { projects } from '@/lib/data'
import SectionHeader from '@/components/ui/SectionHeader'
import ProjectCard from '@/components/ui/ProjectCard'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="FEATURED WORK" title="Selected Projects" />

        <div className="grid md:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Button href="/projects" variant="secondary">
            View All Projects
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
