import { useRef } from 'react'
import { isValidHex } from '../utils/color'

interface PaletteProps {
  palette: string[]
  activeColor: string
  randomMode: boolean
  onColorSelect: (color: string) => void
  onColorAdd: (color: string) => void
  onColorChange: (index: number, color: string) => void
  onColorRemove: (index: number) => void
}

const MAX_COLORS = 10

export function Palette({
  palette,
  activeColor,
  randomMode,
  onColorSelect,
  onColorAdd,
  onColorChange,
  onColorRemove,
}: PaletteProps) {
  const addInputRef = useRef<HTMLInputElement>(null)

  const handleAddClick = () => {
    addInputRef.current?.click()
  }

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorAdd(e.target.value)
  }

  return (
    <div className="px-4 py-3 border-t border-[#1f1f1f]">
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] text-[#555] font-mono mr-2 uppercase tracking-widest">
          palette
        </span>
        {palette.map((color, i) => (
          <ColorSlot
            key={i}
            color={color}
            isActive={!randomMode && activeColor === color}
            onSelect={() => onColorSelect(color)}
            onChange={(newColor) => onColorChange(i, newColor)}
            onRemove={() => onColorRemove(i)}
          />
        ))}
        {palette.length < MAX_COLORS && (
          <button
            onClick={handleAddClick}
            className="w-8 h-8 rounded border border-dashed border-[#333] text-[#555] hover:text-[#888] hover:border-[#555] flex items-center justify-center text-lg transition-colors cursor-pointer"
            title="Add color"
          >
            <input
              ref={addInputRef}
              type="color"
              className="sr-only"
              onChange={handleAddChange}
              defaultValue="#ff0000"
            />
            +
          </button>
        )}
        {randomMode && (
          <span className="ml-2 text-[10px] text-purple-400 font-mono animate-pulse">
            random mode on
          </span>
        )}
      </div>
    </div>
  )
}

function ColorSlot({
  color,
  isActive,
  onSelect,
  onChange,
  onRemove,
}: {
  color: string
  isActive: boolean
  onSelect: () => void
  onChange: (color: string) => void
  onRemove: () => void
}) {
  const editRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        onDoubleClick={() => editRef.current?.click()}
        className={`w-8 h-8 rounded transition-all cursor-pointer ${
          isActive ? 'ring-2 ring-white ring-offset-1 ring-offset-[#0d0d0d]' : 'ring-1 ring-[#333]'
        }`}
        style={{ backgroundColor: color }}
        title={color}
      />
      {/* Edit overlay */}
      <input
        ref={editRef}
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#333] text-[#888] hover:bg-red-600 hover:text-white text-[10px] items-center justify-center hidden group-hover:flex transition-colors cursor-pointer leading-none"
        title="Remove"
      >
        ×
      </button>
    </div>
  )
}

export function HexInput({
  activeColor,
  onChange,
}: {
  activeColor: string
  onChange: (color: string) => void
}) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    if (isValidHex(val)) onChange(val)
  }

  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      <div
        className="w-5 h-5 rounded"
        style={{ backgroundColor: activeColor }}
      />
      <input
        type="text"
        value={activeColor}
        onChange={handleInput}
        maxLength={7}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1 text-xs font-mono text-[#ccc] w-24 focus:outline-none focus:border-[#444]"
        spellCheck={false}
      />
    </div>
  )
}
