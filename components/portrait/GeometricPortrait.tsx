'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGeometricMesh } from './useGeometricMesh'
import type { MousePosition, Triangle, Point } from './types'
import { distance } from '@/lib/utils'

interface GeometricPortraitProps {
  width?: number
  height?: number
  imageSrc?: string
  revealRadius?: number
  className?: string
}

export default function GeometricPortrait({
  width = 280,
  height = 350,
  imageSrc,
  revealRadius = 70,
  className,
}: GeometricPortraitProps) {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mesh = useGeometricMesh({
    width,
    height,
    cols: 11,
    rows: 14,
    randomization: 18,
    connectionDistance: 55,
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    []
  )

  const getTriangleOpacity = useCallback(
    (triangle: Triangle): number => {
      const centerX = (triangle.p1.x + triangle.p2.x + triangle.p3.x) / 3
      const centerY = (triangle.p1.y + triangle.p2.y + triangle.p3.y) / 3
      const dist = distance(mousePos.x, mousePos.y, centerX, centerY)
      return isHovering ? Math.max(0, 1 - dist / revealRadius) : 0
    },
    [mousePos, isHovering, revealRadius]
  )

  const getPointOpacity = useCallback(
    (point: Point): number => {
      const dist = distance(mousePos.x, mousePos.y, point.x, point.y)
      return isHovering ? Math.max(0, 1 - dist / revealRadius) : 0
    },
    [mousePos, isHovering, revealRadius]
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={className}
    >
      <div
        ref={containerRef}
        className="relative cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ width, height }}
      >
        {/* Photo or silhouette placeholder */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="Portrait"
              className="w-full h-full object-cover"
            />
          ) : (
            // Gradient silhouette placeholder
            <div
              className="w-full h-full"
              style={{
                background: `
                  radial-gradient(ellipse 80% 70% at 50% 35%, #1e1e2e 0%, transparent 100%),
                  radial-gradient(ellipse 50% 25% at 50% 85%, #1a1a28 0%, transparent 100%),
                  linear-gradient(180deg, #0f0f15 0%, #0a0a0f 100%)
                `,
              }}
            />
          )}
          {/* Subtle lighting effect */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 30% 30%, rgba(100,120,180,0.15) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* SVG Geometric Overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          style={{ mixBlendMode: 'screen' }}
        >
          {/* Triangle mesh */}
          {mesh.triangles.map((triangle, index) => {
            const opacity = getTriangleOpacity(triangle)
            return (
              <polygon
                key={`tri-${index}`}
                points={`${triangle.p1.x},${triangle.p1.y} ${triangle.p2.x},${triangle.p2.y} ${triangle.p3.x},${triangle.p3.y}`}
                fill={`rgba(59, 130, 246, ${opacity * 0.15})`}
                stroke={`rgba(255, 255, 255, ${opacity * 0.9})`}
                strokeWidth={opacity > 0.1 ? 1 : 0}
                style={{ transition: 'all 0.12s ease-out' }}
              />
            )
          })}

          {/* Vertex points */}
          {mesh.points.map((point, index) => {
            const opacity = getPointOpacity(point)
            return (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={opacity > 0.5 ? 2.5 : 1.5}
                fill={`rgba(139, 92, 246, ${opacity})`}
                style={{ transition: 'all 0.1s ease-out' }}
              />
            )
          })}
        </svg>

        {/* Cursor glow effect */}
        {isHovering && (
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              left: mousePos.x - 50,
              top: mousePos.y - 50,
              width: 100,
              height: 100,
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
              transition: 'left 0.05s, top 0.05s',
            }}
          />
        )}

        {/* Frame border */}
        <div className="absolute inset-0 rounded-2xl border border-border group-hover:border-border-light transition-colors duration-300" />

        {/* Hover hint */}
        <div
          className={`absolute -bottom-8 left-0 right-0 text-center transition-opacity duration-300 ${
            isHovering ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="text-xs text-text-muted font-mono">hover to reveal</span>
        </div>
      </div>
    </motion.div>
  )
}
