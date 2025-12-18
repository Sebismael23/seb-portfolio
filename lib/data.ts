// ============================================
// PERSONAL INFORMATION
// Edit this section with your details
// ============================================

export const personalInfo = {
  name: "Seb",
  fullName: "Sebastien Ismael", // Optional: your full name
  tagline: "I build things that work.",
  title: "Full Stack Developer, Data scientist",
  location: "Utah",
  email: "sebastienismael25@gmail.com", // Replace with your email
  university: "Utah Valley University",
  graduationYear: "2026",
  status: "Available for opportunities",
  bio: [
    "CS student at Utah Valley University, graduating 2026. I like building things, lifting heavy things, and figuring out how stuff works.",
    "Currently deep into database theory, networking protocols, and statistical analysis. I believe in writing code that's clean, efficient, and actually solves problems."
  ],
  social: {
    // github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/sebastien-ismael",
  }
}

// ============================================
// PROJECTS
// ============================================

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  icon: string
  color: string
  github?: string
  live?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: "fithub",
    title: "FitHub",
    description: "Comprehensive gym management system with 22 interconnected tables",
    longDescription: "A full-featured gym management platform handling memberships, class scheduling, trainer assignments, equipment tracking, and member progress analytics.",
    tech: ["MySQL", "Python", "Flask", "Chart.js"],
    icon: "💪",
    color: "#3b82f6",
    github: "https://github.com/yourusername/fithub",
    featured: true
  },
  {
    id: "air-quality",
    title: "Air Quality Analysis",
    description: "EPA data visualization with real-time Grafana dashboards",
    longDescription: "Data pipeline processing EPA air quality metrics with MySQL storage and real-time visualization dashboards for environmental monitoring.",
    tech: ["MySQL", "Grafana", "Python", "Pandas"],
    icon: "🌿",
    color: "#10b981",
    github: "https://github.com/yourusername/air-quality",
    featured: true
  },
  {
    id: "weather-app",
    title: "Weather Stats App",
    description: "Flask-powered weather statistics with interactive charts",
    longDescription: "Weather statistics application featuring historical data analysis, trend visualization, and forecast integration.",
    tech: ["Flask", "REST APIs", "Chart.js", "SQLite"],
    icon: "⛅",
    color: "#f59e0b",
    github: "https://github.com/yourusername/weather-stats",
    live: "https://weather-stats.example.com",
    featured: true
  },

]

// ============================================
// SKILLS
// ============================================

export interface Skill {
  name: string
  level: number // 0-100
  category: 'core' | 'frontend' | 'backend' | 'data' | 'tools'
}

export const skills: Skill[] = [
  // Core Languages
  { name: "Python", level: 70, category: "core" },
  { name: "JavaScript", level: 60, category: "core" },
  { name: "TypeScript", level: 65, category: "core" },
  { name: "SQL", level: 75, category: "core" },
  
  // Backend
  { name: "Flask", level: 55, category: "backend" },
  { name: "Node.js", level: 65, category: "backend" },
  { name: "MySQL", level: 85, category: "backend" },
  { name: "REST APIs", level: 70, category: "backend" },
  
  // Frontend
  { name: "React", level: 75, category: "frontend" },
  { name: "Next.js", level: 60, category: "frontend" },
  { name: "Tailwind", level: 60, category: "frontend" },
  { name: "HTML/CSS", level: 75, category: "frontend" },
  
  // Data & Tools
  { name: "R", level: 35, category: "data" },
  { name: "Pandas", level: 70, category: "data" },
  // { name: "Git", level: 80, category: "tools" },
]

// Skills sorted by level for display
export const skillsSorted = [...skills].sort((a, b) => b.level - a.level)

// ============================================
// NAVIGATION
// ============================================

export const navItems = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

// ============================================
// BOOT SEQUENCE
// ============================================

export const bootMessages = [
  "> initializing seb.portfolio...",
  "> loading modules...",
  "> establishing connection...",
  "> ready."
]

// ============================================
// METADATA
// ============================================

export const siteMetadata = {
  title: "Seb | Full Stack Developer",
  description: "Full stack developer specializing in Python, databases, and web development. CS student at Utah Valley University.",
  url: "https://sebdev.dev", // Replace with your domain
  ogImage: "/og-image.png",
  keywords: [
    "full stack developer",
    "python developer",
    "web developer",
    "utah",
    "software engineer",
    "react",
    "flask"
  ]
}
