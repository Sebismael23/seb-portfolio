'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, external, children, ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background',
      'disabled:opacity-50 disabled:pointer-events-none'
    )

    const variants = {
      primary: 'bg-foreground text-background hover:scale-105 hover:shadow-lg hover:shadow-foreground/10',
      secondary: 'border border-border-light text-foreground hover:border-gray-500 hover:bg-foreground/5',
      ghost: 'text-text-muted hover:text-foreground hover:bg-foreground/5',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
      return (
        <motion.a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={classes}
          whileHover={{ scale: variant === 'primary' ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.a>
      )
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        whileHover={{ scale: variant === 'primary' ? 1.05 : 1 }}
        whileTap={{ scale: 0.98 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
