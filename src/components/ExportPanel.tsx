import { useEffect, useRef } from 'react'
import type { ExportFrame, GridSize } from '../types'
import { exportCanvas } from '../utils/export'

interface ExportPanelProps {
  frame: ExportFrame
  onFrameChange: (frame: ExportFrame) => void
  gridCanvas: HTMLCanvasElement | null
  gridSize: GridSize
}

const FRAMES: { value: ExportFrame; label: string; desc: string }[] = [
  { value: 'none', label: 'No frame', desc: 'clean PNG, transparent bg' },
  { value: 'polaroid', label: 'Polaroid', desc: 'white border + url stamp' },
  { value: 'watermark', label: 'Watermark', desc: 'subtle url overlay' },
]

export function ExportPanel({ frame, onFrameChange, gridCanvas, gridSize }: ExportPanelProps) {
  const previewRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!gridCanvas || !previewRef.current) return
    const preview = previewRef.current
    const ctx = preview.getContext('2d')
    if (!ctx) return

    // Build a preview offscreen canvas based on frame choice
    const source = buildPreviewSource(gridCanvas, frame)
    preview.width = source.width
    preview.height = source.height
    ctx.clearRect(0, 0, preview.width, preview.height)
    ctx.drawImage(source, 0, 0)
  }, [frame, gridCanvas])

  const handleDownload = () => {
    if (!gridCanvas) return
    exportCanvas(gridCanvas, frame, gridSize)
  }

  return (
    <div className="border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-4">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Frame options */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest mb-1">
            frame
          </span>
          {FRAMES.map((f) => (
            <label
              key={f.value}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="frame"
                value={f.value}
                checked={frame === f.value}
                onChange={() => onFrameChange(f.value)}
                className="mt-0.5 accent-white cursor-pointer"
              />
              <div>
                <span className="text-sm font-mono text-[#ccc] group-hover:text-white transition-colors">
                  {f.label}
                </span>
                <p className="text-[10px] text-[#555] font-mono">{f.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest mb-1">
            preview
          </span>
          <div className="bg-[#111] border border-[#1f1f1f] rounded p-3 flex items-center justify-center min-h-20">
            <canvas
              ref={previewRef}
              style={{
                maxWidth: 200,
                maxHeight: 160,
                imageRendering: 'pixelated',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-white text-black text-sm font-mono rounded hover:bg-[#ddd] transition-colors cursor-pointer"
      >
        download PNG
      </button>
    </div>
  )
}

function buildPreviewSource(
  gridCanvas: HTMLCanvasElement,
  frame: ExportFrame
): HTMLCanvasElement {
  const out = document.createElement('canvas')
  const ctx = out.getContext('2d')!

  if (frame === 'none') {
    out.width = gridCanvas.width
    out.height = gridCanvas.height
    ctx.drawImage(gridCanvas, 0, 0)
  } else if (frame === 'polaroid') {
    const padding = 24
    const bottomStrip = 56
    out.width = gridCanvas.width + padding * 2
    out.height = gridCanvas.height + padding + bottomStrip
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, out.width, out.height)
    ctx.drawImage(gridCanvas, padding, padding)
    ctx.font = 'bold 13px "Courier New", Courier, monospace'
    ctx.fillStyle = '#888888'
    ctx.textBaseline = 'middle'
    ctx.fillText('pixeldump.brnrot.fun', padding, out.height - bottomStrip / 2)
  } else {
    out.width = gridCanvas.width
    out.height = gridCanvas.height
    ctx.drawImage(gridCanvas, 0, 0)
    const fontSize = Math.max(10, Math.floor(gridCanvas.width / 20))
    ctx.font = `${fontSize}px "Courier New", Courier, monospace`
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'right'
    const margin = Math.floor(gridCanvas.width / 40)
    ctx.fillText('pixeldump.brnrot.fun', out.width - margin, out.height - margin)
  }

  return out
}
