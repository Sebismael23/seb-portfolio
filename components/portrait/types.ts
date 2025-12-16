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

export interface Mesh {
  points: Point[]
  triangles: Triangle[]
}

export interface MousePosition {
  x: number
  y: number
}
