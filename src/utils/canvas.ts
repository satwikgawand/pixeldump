import type { GridSize } from '../types'

export function createEmptyCells(gridSize: GridSize): string[][] {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(''))
}

export function getCellSize(canvasSize: number, gridSize: GridSize): number {
  return Math.max(8, Math.floor(canvasSize / gridSize))
}

export function getCellFromPoint(
  x: number,
  y: number,
  cellSize: number,
  gridSize: GridSize
): { row: number; col: number } | null {
  const col = Math.floor(x / cellSize)
  const row = Math.floor(y / cellSize)
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null
  return { row, col }
}

export function renderGrid(
  canvas: HTMLCanvasElement,
  cells: string[][],
  gridSize: GridSize,
  cellSize: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // White background
  ctx.fillStyle = '#f8f8f8'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Paint cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const color = cells[row][col]
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 1
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, gridSize * cellSize)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(gridSize * cellSize, i * cellSize)
    ctx.stroke()
  }
}
