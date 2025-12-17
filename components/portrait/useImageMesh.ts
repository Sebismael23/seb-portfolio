'use client'

import { useState, useEffect } from 'react'
import type { Mesh, Point, LineSegment } from './types'

interface ImageMeshConfig {
  imageSrc: string
  width: number
  height: number
  lineThreshold?: number
  minLineLength?: number
}

function getPixelGrayscale(
  imageData: ImageData,
  x: number,
  y: number
): number {
  const idx = (y * imageData.width + x) * 4
  const r = imageData.data[idx]
  const g = imageData.data[idx + 1]
  const b = imageData.data[idx + 2]
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function isLinePixel(imageData: ImageData, x: number, y: number, threshold: number): boolean {
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) return false
  const gray = getPixelGrayscale(imageData, x, y)
  return gray < threshold
}

function getNeighbors(x: number, y: number): Array<{ x: number; y: number; dx: number; dy: number }> {
  return [
    { x: x + 1, y: y, dx: 1, dy: 0 },
    { x: x + 1, y: y + 1, dx: 1, dy: 1 },
    { x: x, y: y + 1, dx: 0, dy: 1 },
    { x: x - 1, y: y + 1, dx: -1, dy: 1 },
    { x: x - 1, y: y, dx: -1, dy: 0 },
    { x: x - 1, y: y - 1, dx: -1, dy: -1 },
    { x: x, y: y - 1, dx: 0, dy: -1 },
    { x: x + 1, y: y - 1, dx: 1, dy: -1 },
  ]
}

function perpendicularDistance(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const length = Math.sqrt(dx * dx + dy * dy)
  
  if (length === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2)
    )
  }
  
  return Math.abs(
    dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x
  ) / length
}

function simplifyPath(
  path: Array<{ x: number; y: number }>,
  tolerance: number
): Array<{ x: number; y: number }> {
  if (path.length <= 2) return path
  
  let maxDist = 0
  let maxIndex = 0
  
  const first = path[0]
  const last = path[path.length - 1]
  
  for (let i = 1; i < path.length - 1; i++) {
    const dist = perpendicularDistance(path[i], first, last)
    if (dist > maxDist) {
      maxDist = dist
      maxIndex = i
    }
  }
  
  if (maxDist > tolerance) {
    const left = simplifyPath(path.slice(0, maxIndex + 1), tolerance)
    const right = simplifyPath(path.slice(maxIndex), tolerance)
    return [...left.slice(0, -1), ...right]
  } else {
    return [first, last]
  }
}

function traceLineSegments(
  imageData: ImageData,
  threshold: number,
  minLength: number,
  targetWidth: number,
  targetHeight: number
): LineSegment[] {
  const width = imageData.width
  const height = imageData.height
  const visited = new Set<string>()
  const lines: LineSegment[] = []
  
  const scaleX = targetWidth / width
  const scaleY = targetHeight / height
  
  let pointId = 0
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const key = `${x},${y}`
      if (visited.has(key)) continue
      if (!isLinePixel(imageData, x, y, threshold)) continue
      
      const neighbors = getNeighbors(x, y)
      
      for (const neighbor of neighbors) {
        if (!isLinePixel(imageData, neighbor.x, neighbor.y, threshold)) continue
        
        const neighborKey = `${neighbor.x},${neighbor.y}`
        if (visited.has(neighborKey)) continue
        
        const path: Array<{ x: number; y: number }> = [{ x, y }]
        let currentX = neighbor.x
        let currentY = neighbor.y
        let lastDx = neighbor.dx
        let lastDy = neighbor.dy
        
        const maxSteps = Math.max(width, height) * 2
        for (let step = 0; step < maxSteps; step++) {
          const currentKey = `${currentX},${currentY}`
          if (visited.has(currentKey)) break
          if (!isLinePixel(imageData, currentX, currentY, threshold)) break
          
          visited.add(currentKey)
          path.push({ x: currentX, y: currentY })
          
          const nextNeighbors = getNeighbors(currentX, currentY)
          let bestNext: { x: number; y: number; dx: number; dy: number } | null = null
          let bestScore = -1
          
          for (const next of nextNeighbors) {
            const nextKey = `${next.x},${next.y}`
            if (visited.has(nextKey)) continue
            if (!isLinePixel(imageData, next.x, next.y, threshold)) continue
            
            const dotProduct = next.dx * lastDx + next.dy * lastDy
            const score = dotProduct + 1
            
            if (score > bestScore) {
              bestScore = score
              bestNext = next
            }
          }
          
          if (!bestNext) break
          
          currentX = bestNext.x
          currentY = bestNext.y
          lastDx = bestNext.dx
          lastDy = bestNext.dy
        }
        
        if (path.length >= 2) {
          const simplified = simplifyPath(path, 2)
          
          for (let i = 0; i < simplified.length - 1; i++) {
            const p1 = simplified[i]
            const p2 = simplified[i + 1]
            
            const dx = p2.x - p1.x
            const dy = p2.y - p1.y
            const length = Math.sqrt(dx * dx + dy * dy)
            
            if (length >= minLength) {
              lines.push({
                p1: { x: p1.x * scaleX, y: p1.y * scaleY, id: pointId++ },
                p2: { x: p2.x * scaleX, y: p2.y * scaleY, id: pointId++ },
              })
            }
          }
        }
      }
      
      visited.add(key)
    }
  }
  
  return lines
}

function extractPoints(lines: LineSegment[]): Point[] {
  const pointMap = new Map<string, Point>()
  
  for (const line of lines) {
    const key1 = `${Math.round(line.p1.x)},${Math.round(line.p1.y)}`
    const key2 = `${Math.round(line.p2.x)},${Math.round(line.p2.y)}`
    
    if (!pointMap.has(key1)) {
      pointMap.set(key1, line.p1)
    }
    if (!pointMap.has(key2)) {
      pointMap.set(key2, line.p2)
    }
  }
  
  return Array.from(pointMap.values())
}

export function useImageMesh(config: ImageMeshConfig): {
  mesh: Mesh
  isLoading: boolean
  error: string | null
} {
  const {
    imageSrc,
    width,
    height,
    lineThreshold = 180,
    minLineLength = 3,
  } = config

  const [mesh, setMesh] = useState<Mesh>({ points: [], triangles: [], lines: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imageSrc) {
      setIsLoading(false)
      return
    }

    const processImage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const img = new Image()
        if (imageSrc.startsWith('http')) {
          img.crossOrigin = 'anonymous'
        }
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            console.log('Line art loaded:', img.width, 'x', img.height)
            resolve()
          }
          img.onerror = (e) => {
            console.error('Image load error:', e)
            reject(new Error('Failed to load image'))
          }
          img.src = imageSrc
        })

        const canvas = document.createElement('canvas')
        const scale = 2
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        const lines = traceLineSegments(
          imageData,
          lineThreshold,
          minLineLength * scale,
          width,
          height
        )
        console.log('Lines traced:', lines.length)
        
        const points = extractPoints(lines)
        console.log('Points extracted:', points.length)
        
        setMesh({ points, triangles: [], lines })
      } catch (err) {
        console.error('useImageMesh error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setMesh({ points: [], triangles: [], lines: [] })
      } finally {
        setIsLoading(false)
      }
    }

    processImage()
  }, [imageSrc, width, height, lineThreshold, minLineLength])

  return { mesh, isLoading, error }
}
