import { useRef, useState, useCallback } from 'react'
import type { GridSize, Tool, ExportFrame } from './types'
import { createEmptyCells } from './utils/canvas'
import { Header } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { PixelCanvas } from './components/PixelCanvas'
import { Palette, HexInput } from './components/Palette'
import { ExportPanel } from './components/ExportPanel'

const DEFAULT_PALETTE = ['#ff0000', '#ff6600', '#ffff00', '#00cc44', '#0066ff', '#9933ff', '#ffffff', '#000000']

export default function App() {
  const [gridSize, setGridSize] = useState<GridSize>(16)
  const [cells, setCells] = useState<string[][]>(() => createEmptyCells(16))
  const [palette, setPalette] = useState<string[]>(DEFAULT_PALETTE)
  const [activeColor, setActiveColor] = useState<string>('#ff0000')
  const [activeTool, setActiveTool] = useState<Tool>('paint')
  const [randomMode, setRandomMode] = useState(false)
  const [exportFrame, setExportFrame] = useState<ExportFrame>('none')
  const [exportOpen, setExportOpen] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleGridSizeChange = useCallback((size: GridSize) => {
    if (size === gridSize) return
    if (!confirm('this will clear your canvas. you sure?')) return
    setGridSize(size)
    setCells(createEmptyCells(size))
  }, [gridSize])

  const handleCellPaint = useCallback((row: number, col: number, color: string) => {
    setCells((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = color
      return next
    })
  }, [])

  const handleClear = useCallback(() => {
    if (!confirm('nuke it?')) return
    setCells(createEmptyCells(gridSize))
  }, [gridSize])

  const handleColorSelect = useCallback((color: string) => {
    setActiveColor(color)
    setActiveTool('paint')
    setRandomMode(false)
  }, [])

  const handleColorAdd = useCallback((color: string) => {
    setPalette((prev) => {
      if (prev.length >= 10) return prev
      return [...prev, color]
    })
    setActiveColor(color)
    setActiveTool('paint')
    setRandomMode(false)
  }, [])

  const handleColorChange = useCallback((index: number, color: string) => {
    setPalette((prev) => {
      const next = [...prev]
      next[index] = color
      return next
    })
    setActiveColor(color)
  }, [])

  const handleColorRemove = useCallback((index: number) => {
    setPalette((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return next
    })
  }, [])

  const handleRandomToggle = useCallback(() => {
    setRandomMode((prev) => !prev)
    setActiveTool('paint')
  }, [])

  const handleToolChange = useCallback((tool: Tool) => {
    setActiveTool(tool)
    if (tool === 'eraser') setRandomMode(false)
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex flex-col min-h-screen">
        <Header gridSize={gridSize} onGridSizeChange={handleGridSizeChange} />

        <Toolbar
          activeTool={activeTool}
          randomMode={randomMode}
          onToolChange={handleToolChange}
          onRandomModeToggle={handleRandomToggle}
          onClear={handleClear}
          onExportToggle={() => setExportOpen((o) => !o)}
          exportOpen={exportOpen}
        />

        <div className="flex-1 flex flex-col">
          <PixelCanvas
            cells={cells}
            gridSize={gridSize}
            activeTool={activeTool}
            activeColor={activeColor}
            randomMode={randomMode}
            onCellPaint={handleCellPaint}
            canvasRef={canvasRef}
          />
        </div>

        <div className="mt-auto">
          <Palette
            palette={palette}
            activeColor={activeColor}
            randomMode={randomMode}
            onColorSelect={handleColorSelect}
            onColorAdd={handleColorAdd}
            onColorChange={handleColorChange}
            onColorRemove={handleColorRemove}
          />
          <HexInput activeColor={activeColor} onChange={setActiveColor} />

          {exportOpen && (
            <ExportPanel
              frame={exportFrame}
              onFrameChange={setExportFrame}
              gridCanvas={canvasRef.current}
              gridSize={gridSize}
            />
          )}
        </div>
      </div>
    </div>
  )
}
