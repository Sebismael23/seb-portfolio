'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useImageMesh } from './useImageMesh'
import { useGeometricMesh } from './useGeometricMesh'
import type { MousePosition, LineSegment } from './types'
import { distance } from '@/lib/utils'

interface GeometricPortraitProps {
  width?: number
  height?: number
  imageSrcLight?: string
  imageSrcDark?: string
  meshSrcLight?: string
  meshSrcDark?: string
  revealRadius?: number
  className?: string
  lineThreshold?: number
  minLineLength?: number
}

export default function GeometricPortrait({
  width = 280,
  height = 350,
  imageSrcLight = '/images/sebPortfolio1.jpeg',
  imageSrcDark = '/images/sebPortfolio2.jpeg',
  meshSrcLight = '/images/sebPortfolio1geometrics.jpg',
  meshSrcDark = '/images/sebPortfolio2geometrics.jpg',
  revealRadius = 80,
  className,
  lineThreshold = 180,
  minLineLength = 5,
}: GeometricPortraitProps) {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    // Initial check
    checkDarkMode()
    
    // Watch for changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  // Select display image based on theme (the actual photo)
  const imageSrc = isDarkMode ? imageSrcDark : imageSrcLight
  
  // Select mesh source image based on theme (the line art for edge extraction)
  const meshSrc = isDarkMode ? meshSrcDark : meshSrcLight

  // Use line art image for mesh extraction
  const { mesh: imageMesh, isLoading } = useImageMesh({
    imageSrc: meshSrc || '',
    width,
    height,
    lineThreshold,
    minLineLength,
  })

  // Fallback mesh for when no image or still loading
  const fallbackMesh = useGeometricMesh({
    width,
    height,
    cols: 11,
    rows: 14,
    randomization: 18,
    connectionDistance: 55,
  })

  // Use image mesh if available and loaded, otherwise fallback
  const mesh = meshSrc && !isLoading && imageMesh.lines && imageMesh.lines.length > 0 
    ? imageMesh 
    : { ...fallbackMesh, lines: [] }

  // Scale factor for hover effect
  const hoverScale = 1.35
  const baseScale = 1.1
  const currentScale = isHovering ? hoverScale : baseScale

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate center of the element
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Get mouse position relative to center, then adjust for scale
      const relativeX = (e.clientX - centerX) / currentScale
      const relativeY = (e.clientY - centerY) / currentScale
      
      // Convert back to top-left origin coordinates
      setMousePos({
        x: width / 2 + relativeX,
        y: height / 2 + relativeY,
      })
    },
    [currentScale, width, height]
  )

  // Get opacity for a line segment based on distance from mouse
  const getLineOpacity = useCallback(
    (line: LineSegment): number => {
      const centerX = (line.p1.x + line.p2.x) / 2
      const centerY = (line.p1.y + line.p2.y) / 2
      const dist = distance(mousePos.x, mousePos.y, centerX, centerY)
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
        className="relative cursor-crosshair group transition-transform duration-300 ease-out"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ 
          width, 
          height,
          transform: `scale(${currentScale})`,
        }}
      >
        {/* Photo or silhouette placeholder */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt="Portrait"
              className="w-full h-full object-contain"
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

        {/* Dark overlay that follows cursor - darkens the photo to reveal lines */}
        {isHovering && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
            style={{
              background: `radial-gradient(circle ${revealRadius * 1.5}px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 40%, transparent 100%)`,
              transition: 'background 0.05s ease-out',
            }}
          />
        )}

        {/* SVG Geometric Overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          style={{ mixBlendMode: 'screen' }}
        >
          {/* Line segments traced from line art */}
          {mesh.lines && mesh.lines.map((line, index) => {
            const opacity = getLineOpacity(line)
            return (
              <line
                key={`line-${index}`}
                x1={line.p1.x}
                y1={line.p1.y}
                x2={line.p2.x}
                y2={line.p2.y}
                stroke={`rgba(255, 255, 255, ${opacity})`}
                strokeWidth={opacity > 0.1 ? 1.2 : 0}
                strokeLinecap="round"
                style={{ transition: 'all 0.1s ease-out' }}
              />
            )
          })}
        </svg>

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
