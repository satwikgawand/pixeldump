import type { GridSize } from '../types'

interface HeaderProps {
  gridSize: GridSize
  onGridSizeChange: (size: GridSize) => void
}

const GRID_SIZES: GridSize[] = [8, 16, 32, 64]

export function Header({ gridSize, onGridSizeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
      <h1 className="text-xl font-bold tracking-tight text-white font-mono">
        pixeldump
      </h1>
      <div className="flex items-center gap-1">
        {GRID_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => onGridSizeChange(size)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
              gridSize === size
                ? 'bg-white text-black'
                : 'bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {size}×{size}
          </button>
        ))}
      </div>
    </header>
  )
}
