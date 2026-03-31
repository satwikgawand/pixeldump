import type { ExportFrame, GridSize } from '../types'

export function exportCanvas(
  gridCanvas: HTMLCanvasElement,
  frame: ExportFrame,
  gridSize: GridSize
): void {
  let exportCanvas: HTMLCanvasElement

  if (frame === 'polaroid') {
    exportCanvas = buildPolaroid(gridCanvas)
  } else if (frame === 'watermark') {
    exportCanvas = buildWatermark(gridCanvas)
  } else {
    exportCanvas = buildClean(gridCanvas)
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const filename = `pixeldump-${gridSize}x${gridSize}-${timestamp}.png`

  exportCanvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  })
}

function buildClean(gridCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = gridCanvas.width
  out.height = gridCanvas.height
  const ctx = out.getContext('2d')!
  ctx.drawImage(gridCanvas, 0, 0)
  return out
}

function buildPolaroid(gridCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const padding = 24
  const bottomStrip = 56
  const out = document.createElement('canvas')
  out.width = gridCanvas.width + padding * 2
  out.height = gridCanvas.height + padding + bottomStrip
  const ctx = out.getContext('2d')!

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, out.width, out.height)

  ctx.drawImage(gridCanvas, padding, padding)

  ctx.font = 'bold 13px "Courier New", Courier, monospace'
  ctx.fillStyle = '#888888'
  ctx.textBaseline = 'middle'
  ctx.fillText('pixeldump.brnrot.fun', padding, out.height - bottomStrip / 2)

  return out
}

function buildWatermark(gridCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = gridCanvas.width
  out.height = gridCanvas.height
  const ctx = out.getContext('2d')!

  ctx.drawImage(gridCanvas, 0, 0)

  const fontSize = Math.max(10, Math.floor(gridCanvas.width / 20))
  ctx.font = `${fontSize}px "Courier New", Courier, monospace`
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.textBaseline = 'bottom'
  ctx.textAlign = 'right'

  const text = 'pixeldump.brnrot.fun'
  const margin = Math.floor(gridCanvas.width / 40)
  ctx.fillText(text, out.width - margin, out.height - margin)

  return out
}
