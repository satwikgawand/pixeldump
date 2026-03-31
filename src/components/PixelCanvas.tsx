import { useRef, useEffect, useCallback, useState } from 'react'
import type { GridSize, Tool } from '../types'
import { getCellFromPoint, renderGrid } from '../utils/canvas'
import { randomHex } from '../utils/color'

interface PixelCanvasProps {
  cells: string[][]
  gridSize: GridSize
  activeTool: Tool
  activeColor: string
  randomMode: boolean
  onCellPaint: (row: number, col: number, color: string) => void
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function PixelCanvas({
  cells,
  gridSize,
  activeTool,
  activeColor,
  randomMode,
  onCellPaint,
  canvasRef,
}: PixelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellSize, setCellSize] = useState(16)
  const isPainting = useRef(false)
  const paintedCells = useRef<Set<string>>(new Set())

  // Compute canvas size from container
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const maxSize = Math.min(containerWidth, 640)
      const cs = Math.max(8, Math.floor(maxSize / gridSize))
      setCellSize(cs)
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [gridSize])

  // Render grid whenever cells or dimensions change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    renderGrid(canvas, cells, gridSize, cellSize)
  }, [cells, gridSize, cellSize, canvasRef])

  const getEventPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      let clientX: number, clientY: number
      if ('touches' in e) {
        if (e.touches.length === 0) return null
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      }
    },
    [canvasRef]
  )

  const paintAt = useCallback(
    (x: number, y: number) => {
      const cell = getCellFromPoint(x, y, cellSize, gridSize)
      if (!cell) return
      const key = `${cell.row},${cell.col}`
      if (paintedCells.current.has(key)) return
      paintedCells.current.add(key)

      if (activeTool === 'eraser') {
        onCellPaint(cell.row, cell.col, '')
      } else {
        const color = randomMode ? randomHex() : activeColor
        onCellPaint(cell.row, cell.col, color)
      }
    },
    [cellSize, gridSize, activeTool, activeColor, randomMode, onCellPaint]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isPainting.current = true
      paintedCells.current = new Set()
      const pos = getEventPos(e)
      if (pos) paintAt(pos.x, pos.y)
    },
    [getEventPos, paintAt]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPainting.current) return
      const pos = getEventPos(e)
      if (pos) paintAt(pos.x, pos.y)
    },
    [getEventPos, paintAt]
  )

  const handleMouseUp = useCallback(() => {
    isPainting.current = false
    paintedCells.current = new Set()
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      isPainting.current = true
      paintedCells.current = new Set()
      const pos = getEventPos(e)
      if (pos) paintAt(pos.x, pos.y)
    },
    [getEventPos, paintAt]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      if (!isPainting.current) return
      const pos = getEventPos(e)
      if (pos) paintAt(pos.x, pos.y)
    },
    [getEventPos, paintAt]
  )

  const handleTouchEnd = useCallback(() => {
    isPainting.current = false
    paintedCells.current = new Set()
  }, [])

  const canvasSize = cellSize * gridSize

  return (
    <div ref={containerRef} className="w-full flex justify-center py-4 px-4">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          width: canvasSize,
          height: canvasSize,
          maxWidth: '100%',
          cursor: activeTool === 'eraser' ? 'cell' : 'crosshair',
          touchAction: 'none',
          userSelect: 'none',
          borderRadius: 2,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
