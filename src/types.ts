export type GridSize = 8 | 16 | 32 | 64
export type Tool = 'paint' | 'eraser'
export type ExportFrame = 'none' | 'polaroid' | 'watermark'

export interface AppState {
  gridSize: GridSize
  cells: string[][]
  palette: string[]
  activeColor: string
  activeTool: Tool
  randomMode: boolean
  exportFrame: ExportFrame
}
