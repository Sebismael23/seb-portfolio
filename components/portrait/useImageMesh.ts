'use client'

import { useState, useEffect } from 'react'
import type { Mesh, Point, Triangle } from './types'

interface ImageMeshConfig {
  imageSrc: string
  width: number
  height: number
  edgeThreshold?: number
  pointDensity?: number
  maxPoints?: number
}

// Sobel edge detection kernels
const SOBEL_X = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
]

const SOBEL_Y = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
]

// Gaussian blur kernel for noise reduction
const GAUSSIAN_3x3 = [
  [1/16, 2/16, 1/16],
  [2/16, 4/16, 2/16],
  [1/16, 2/16, 1/16],
]

function getPixelGrayscale(
  imageData: ImageData,
  x: number,
  y: number
): number {
  const idx = (y * imageData.width + x) * 4
  const r = imageData.data[idx]
  const g = imageData.data[idx + 1]
  const b = imageData.data[idx + 2]
  // Luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function applyKernel(
  grayscale: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  kernel: number[][]
): number {
  let sum = 0
  for (let ky = -1; ky <= 1; ky++) {
    for (let kx = -1; kx <= 1; kx++) {
      const px = Math.min(Math.max(x + kx, 0), width - 1)
      const py = Math.min(Math.max(y + ky, 0), height - 1)
      const gray = grayscale[py * width + px]
      sum += gray * kernel[ky + 1][kx + 1]
    }
  }
  return sum
}

function detectEdges(imageData: ImageData): { edges: Float32Array; directions: Float32Array } {
  const width = imageData.width
  const height = imageData.height
  
  // Convert to grayscale
  const grayscale = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grayscale[y * width + x] = getPixelGrayscale(imageData, x, y)
    }
  }
  
  // Apply Gaussian blur to reduce noise
  const blurred = new Float32Array(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      blurred[y * width + x] = applyKernel(grayscale, width, height, x, y, GAUSSIAN_3x3)
    }
  }
  
  // Apply Sobel operator
  const edges = new Float32Array(width * height)
  const directions = new Float32Array(width * height)
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const gx = applyKernel(blurred, width, height, x, y, SOBEL_X)
      const gy = applyKernel(blurred, width, height, x, y, SOBEL_Y)
      const magnitude = Math.sqrt(gx * gx + gy * gy)
      edges[y * width + x] = magnitude
      directions[y * width + x] = Math.atan2(gy, gx)
    }
  }
  
  // Non-maximum suppression for thinner edges
  const suppressed = new Float32Array(width * height)
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const angle = directions[y * width + x]
      const mag = edges[y * width + x]
      
      // Get neighbors in gradient direction
      let neighbor1 = 0, neighbor2 = 0
      const normalizedAngle = ((angle + Math.PI) / Math.PI) * 4 % 4
      
      if (normalizedAngle < 1 || normalizedAngle >= 3) {
        // Horizontal
        neighbor1 = edges[y * width + (x - 1)]
        neighbor2 = edges[y * width + (x + 1)]
      } else if (normalizedAngle >= 1 && normalizedAngle < 2) {
        // Diagonal /
        neighbor1 = edges[(y - 1) * width + (x + 1)]
        neighbor2 = edges[(y + 1) * width + (x - 1)]
      } else {
        // Diagonal \
        neighbor1 = edges[(y - 1) * width + (x - 1)]
        neighbor2 = edges[(y + 1) * width + (x + 1)]
      }
      
      // Keep only local maxima
      if (mag >= neighbor1 && mag >= neighbor2) {
        suppressed[y * width + x] = mag
      }
    }
  }
  
  return { edges: suppressed, directions }
}

function sampleEdgePoints(
  edges: Float32Array,
  width: number,
  height: number,
  threshold: number,
  density: number,
  maxPoints: number
): Point[] {
  const points: Point[] = []
  
  // Normalize edges to 0-255 range for better thresholding
  let maxEdge = 0
  for (let i = 0; i < edges.length; i++) {
    if (edges[i] > maxEdge) maxEdge = edges[i]
  }
  const normalizedThreshold = (threshold / 255) * maxEdge
  
  // Adaptive sampling - smaller step for denser point coverage
  const baseStep = Math.max(2, Math.floor(1 / density))
  
  // Sample points along edges with adaptive density
  for (let y = baseStep; y < height - baseStep; y += baseStep) {
    for (let x = baseStep; x < width - baseStep; x += baseStep) {
      const edgeValue = edges[y * width + x]
      
      if (edgeValue > normalizedThreshold) {
        // Stronger edges get points more reliably
        const strength = edgeValue / maxEdge
        
        // Add slight jitter for organic look, less jitter for strong edges
        const jitterAmount = baseStep * 0.3 * (1 - strength * 0.5)
        const jitterX = (Math.random() - 0.5) * jitterAmount
        const jitterY = (Math.random() - 0.5) * jitterAmount
        
        points.push({
          x: x + jitterX,
          y: y + jitterY,
          id: points.length,
        })
        
        // For very strong edges, add additional nearby points for detail
        if (strength > 0.6 && Math.random() > 0.5) {
          const offsetX = (Math.random() - 0.5) * baseStep
          const offsetY = (Math.random() - 0.5) * baseStep
          points.push({
            x: x + offsetX,
            y: y + offsetY,
            id: points.length,
          })
        }
      }
    }
  }
  
  // Add grid points for better coverage (sparse background mesh)
  const gridStep = Math.max(25, width / 12)
  for (let y = gridStep; y < height - gridStep; y += gridStep) {
    for (let x = gridStep; x < width - gridStep; x += gridStep) {
      // Only add if not too close to existing edge points
      const hasNearby = points.some(p => 
        Math.abs(p.x - x) < gridStep * 0.4 && Math.abs(p.y - y) < gridStep * 0.4
      )
      if (!hasNearby) {
        points.push({ x, y, id: points.length })
      }
    }
  }
  
  // Add boundary points for better triangulation
  const boundaryStep = Math.max(15, width / 20)
  for (let x = 0; x <= width; x += boundaryStep) {
    points.push({ x, y: 0, id: points.length })
    points.push({ x, y: height, id: points.length })
  }
  for (let y = boundaryStep; y < height; y += boundaryStep) {
    points.push({ x: 0, y, id: points.length })
    points.push({ x: width, y, id: points.length })
  }
  
  // Add corner points
  points.push({ x: 0, y: 0, id: points.length })
  points.push({ x: width, y: 0, id: points.length })
  points.push({ x: 0, y: height, id: points.length })
  points.push({ x: width, y: height, id: points.length })
  
  // Limit points if too many, prioritizing edge points
  if (points.length > maxPoints) {
    // Sort by how close they are to strong edges (approximate by keeping earlier points)
    const edgePointCount = points.length - Math.floor(width / boundaryStep) * 2 - Math.floor(height / boundaryStep) * 2 - 4
    const boundaryPoints = points.slice(edgePointCount)
    const edgePoints = points.slice(0, edgePointCount)
    
    // Keep a good sample of edge points
    const sampledEdge = edgePoints
      .sort(() => Math.random() - 0.5)
      .slice(0, maxPoints - boundaryPoints.length)
    
    return [...sampledEdge, ...boundaryPoints].map((p, i) => ({ ...p, id: i }))
  }
  
  return points
}

// Delaunay triangulation using Bowyer-Watson algorithm
function delaunayTriangulate(points: Point[], width: number, height: number): Triangle[] {
  if (points.length < 3) return []
  
  // Create super triangle that contains all points
  const margin = Math.max(width, height) * 3
  const superPoints: Point[] = [
    { x: width / 2, y: -margin, id: -1 },
    { x: -margin, y: height + margin, id: -2 },
    { x: width + margin, y: height + margin, id: -3 },
  ]
  
  let triangles: Triangle[] = [{
    p1: superPoints[0],
    p2: superPoints[1],
    p3: superPoints[2],
  }]
  
  // Add points one at a time
  for (const point of points) {
    const badTriangles: Triangle[] = []
    
    // Find all triangles whose circumcircle contains the point
    for (const triangle of triangles) {
      if (isPointInCircumcircle(point, triangle)) {
        badTriangles.push(triangle)
      }
    }
    
    // If no bad triangles found, skip this point
    if (badTriangles.length === 0) continue
    
    // Find the boundary of the polygonal hole
    const polygon: Array<{ p1: Point; p2: Point }> = []
    
    for (const triangle of badTriangles) {
      const edges = [
        { p1: triangle.p1, p2: triangle.p2 },
        { p1: triangle.p2, p2: triangle.p3 },
        { p1: triangle.p3, p2: triangle.p1 },
      ]
      
      for (const edge of edges) {
        // Check if edge is shared with another bad triangle
        let isShared = false
        for (const other of badTriangles) {
          if (other === triangle) continue
          if (hasEdge(other, edge)) {
            isShared = true
            break
          }
        }
        if (!isShared) {
          polygon.push(edge)
        }
      }
    }
    
    // Remove bad triangles
    triangles = triangles.filter((t) => !badTriangles.includes(t))
    
    // Create new triangles from polygon edges to point
    for (const edge of polygon) {
      triangles.push({
        p1: edge.p1,
        p2: edge.p2,
        p3: point,
      })
    }
  }
  
  // Remove triangles that share vertices with super triangle
  triangles = triangles.filter(
    (t) =>
      t.p1.id >= 0 &&
      t.p2.id >= 0 &&
      t.p3.id >= 0
  )
  
  return triangles
}

// Calculate circumcircle and check if point is inside
function isPointInCircumcircle(point: Point, triangle: Triangle): boolean {
  const { p1, p2, p3 } = triangle
  
  // Calculate the circumcenter
  const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y))
  
  if (Math.abs(d) < 1e-10) return false // Degenerate triangle
  
  const ux = ((p1.x * p1.x + p1.y * p1.y) * (p2.y - p3.y) + 
              (p2.x * p2.x + p2.y * p2.y) * (p3.y - p1.y) + 
              (p3.x * p3.x + p3.y * p3.y) * (p1.y - p2.y)) / d
  const uy = ((p1.x * p1.x + p1.y * p1.y) * (p3.x - p2.x) + 
              (p2.x * p2.x + p2.y * p2.y) * (p1.x - p3.x) + 
              (p3.x * p3.x + p3.y * p3.y) * (p2.x - p1.x)) / d
  
  // Circumradius squared
  const radiusSq = (p1.x - ux) * (p1.x - ux) + (p1.y - uy) * (p1.y - uy)
  
  // Distance from point to circumcenter squared
  const distSq = (point.x - ux) * (point.x - ux) + (point.y - uy) * (point.y - uy)
  
  return distSq <= radiusSq
}

function hasEdge(triangle: Triangle, edge: { p1: Point; p2: Point }): boolean {
  const points = [triangle.p1, triangle.p2, triangle.p3]
  let hasP1 = false
  let hasP2 = false
  
  for (const p of points) {
    if (p.id === edge.p1.id) hasP1 = true
    if (p.id === edge.p2.id) hasP2 = true
  }
  
  return hasP1 && hasP2
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
    edgeThreshold = 50,
    pointDensity = 0.08,
    maxPoints = 500,
  } = config

  const [mesh, setMesh] = useState<Mesh>({ points: [], triangles: [] })
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
        // Create image element
        const img = new Image()
        // Don't set crossOrigin for local images
        if (imageSrc.startsWith('http')) {
          img.crossOrigin = 'anonymous'
        }
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            console.log('Image loaded successfully:', img.width, img.height)
            resolve()
          }
          img.onerror = (e) => {
            console.error('Image load error:', e)
            reject(new Error('Failed to load image'))
          }
          img.src = imageSrc
        })

        // Create canvas and draw image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        // Draw image scaled to canvas size
        ctx.drawImage(img, 0, 0, width, height)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height)
        
        // Detect edges
        const { edges } = detectEdges(imageData)
        console.log('Edges detected, max value:', Math.max(...edges))
        
        // Sample points along edges
        const points = sampleEdgePoints(
          edges,
          width,
          height,
          edgeThreshold,
          pointDensity,
          maxPoints
        )
        console.log('Points sampled:', points.length)
        
        // Create triangles using Delaunay triangulation
        const triangles = delaunayTriangulate(points, width, height)
        console.log('Triangles created:', triangles.length)
        
        setMesh({ points, triangles })
      } catch (err) {
        console.error('useImageMesh error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Fallback to empty mesh
        setMesh({ points: [], triangles: [] })
      } finally {
        setIsLoading(false)
      }
    }

    processImage()
  }, [imageSrc, width, height, edgeThreshold, pointDensity, maxPoints])

  return { mesh, isLoading, error }
}
