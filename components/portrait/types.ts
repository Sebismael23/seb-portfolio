export interface Point {
  x: number
  y: number
  id: number
}

export interface Triangle {
  p1: Point
  p2: Point
  p3: Point
}

// Line segment between two points
export interface LineSegment {
  p1: Point
  p2: Point
}

export interface Mesh {
  points: Point[]
  triangles: Triangle[]
  lines: LineSegment[]  // Direct line segments traced from line art
}

export interface MousePosition {
  x: number
  y: number
}
