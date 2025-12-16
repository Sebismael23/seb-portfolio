'use client'

import { useMemo } from 'react'
import type { Mesh, Point, Triangle } from './types'

interface MeshConfig {
  width: number
  height: number
  cols?: number
  rows?: number
  randomization?: number
  connectionDistance?: number
}

export function useGeometricMesh(config: MeshConfig): Mesh {
  const {
    width,
    height,
    cols = 11,
    rows = 14,
    randomization = 18,
    connectionDistance = 55,
  } = config

  return useMemo(() => {
    const points: Point[] = []
    const triangles: Triangle[] = []

    // Head shape mask function
    const isInHead = (x: number, y: number): boolean => {
      const centerX = width / 2
      const headCenterY = height * 0.35
      const headRadiusX = width * 0.4
      const headRadiusY = height * 0.35

      // Check if in head ellipse
      const inHead =
        Math.pow((x - centerX) / headRadiusX, 2) +
          Math.pow((y - headCenterY) / headRadiusY, 2) <=
        1

      // Check if in neck area
      const neckTop = height * 0.6
      const neckWidth = width * 0.22
      const inNeck =
        y > neckTop &&
        y < height * 0.85 &&
        x > centerX - neckWidth &&
        x < centerX + neckWidth

      // Shoulder area
      const shoulderTop = height * 0.75
      const inShoulders =
        y > shoulderTop && y < height && x > width * 0.08 && x < width * 0.92

      return inHead || inNeck || inShoulders
    }

    // Generate points with seeded randomization for consistency
    const seededRandom = (seed: number): number => {
      const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
      return x - Math.floor(x)
    }

    let pointId = 0
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const baseX = (col / cols) * width
        const baseY = (row / rows) * height

        // Add randomization for organic look (less at edges)
        const edgeFactor = Math.min(col, cols - col, row, rows - row) / 3
        const seed = row * cols + col
        const randomX =
          (seededRandom(seed) - 0.5) * randomization * Math.min(edgeFactor, 1)
        const randomY =
          (seededRandom(seed + 1000) - 0.5) *
          randomization *
          Math.min(edgeFactor, 1)

        const x = baseX + randomX
        const y = baseY + randomY

        if (isInHead(x, y)) {
          points.push({ x, y, id: pointId++ })
        }
      }
    }

    // Create triangles by connecting nearby points
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]

      // Find nearby points
      const nearby = points
        .filter((p, idx) => idx !== i)
        .map((p) => ({
          ...p,
          dist: Math.sqrt(Math.pow(p.x - p1.x, 2) + Math.pow(p.y - p1.y, 2)),
        }))
        .filter((p) => p.dist < connectionDistance)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 6)

      // Create triangles with pairs of nearby points
      for (let j = 0; j < nearby.length - 1; j++) {
        const p2 = nearby[j]
        const p3 = nearby[j + 1]

        // Check if this triangle already exists
        const exists = triangles.some((t) => {
          const ids = [t.p1.id, t.p2.id, t.p3.id].sort().join(',')
          const newIds = [p1.id, p2.id, p3.id].sort().join(',')
          return ids === newIds
        })

        if (!exists) {
          triangles.push({
            p1: { x: p1.x, y: p1.y, id: p1.id },
            p2: { x: p2.x, y: p2.y, id: p2.id },
            p3: { x: p3.x, y: p3.y, id: p3.id },
          })
        }
      }
    }

    return { points, triangles }
  }, [width, height, cols, rows, randomization, connectionDistance])
}
