'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/lib/data'
import ProjectCard from '@/components/ui/ProjectCard'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'web' | 'data' | 'other'>('all')

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true
    if (filter === 'web') return project.tech.some(t => ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js'].includes(t))
    if (filter === 'data') return project.tech.some(t => ['Python', 'SQL', 'PostgreSQL', 'R'].includes(t))
    return false
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-accent-blue text-sm tracking-widest mb-4 font-mono">
              ALL PROJECTS
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              My Work
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              A collection of projects I&apos;ve built, from web applications to data analysis.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {(['all', 'web', 'data', 'other'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === filterOption
                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                    : 'bg-card-bg text-foreground border border-border hover:border-accent-blue'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>

          {/* No results message */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-text-muted text-lg">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
