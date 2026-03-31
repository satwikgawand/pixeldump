import type { Tool } from '../types'

interface ToolbarProps {
  activeTool: Tool
  randomMode: boolean
  onToolChange: (tool: Tool) => void
  onRandomModeToggle: () => void
  onClear: () => void
  onExportToggle: () => void
  exportOpen: boolean
}

export function Toolbar({
  activeTool,
  randomMode,
  onToolChange,
  onRandomModeToggle,
  onClear,
  onExportToggle,
  exportOpen,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1f1f1f]">
      {/* Paint */}
      <ToolButton
        active={activeTool === 'paint' && !randomMode}
        onClick={() => onToolChange('paint')}
        title="Paint"
      >
        <PencilIcon />
      </ToolButton>

      {/* Eraser */}
      <ToolButton
        active={activeTool === 'eraser'}
        onClick={() => onToolChange('eraser')}
        title="Eraser"
      >
        <EraserIcon />
      </ToolButton>

      <div className="w-px h-5 bg-[#2a2a2a] mx-1" />

      {/* Random */}
      <ToolButton
        active={randomMode}
        onClick={onRandomModeToggle}
        title="Random color mode"
        accent
      >
        <DiceIcon />
      </ToolButton>

      <div className="w-px h-5 bg-[#2a2a2a] mx-1" />

      {/* Clear */}
      <ToolButton active={false} onClick={onClear} title="Clear canvas" danger>
        <TrashIcon />
      </ToolButton>

      <div className="flex-1" />

      {/* Export */}
      <button
        onClick={onExportToggle}
        title="Export"
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
          exportOpen
            ? 'bg-white text-black'
            : 'bg-[#1a1a1a] text-[#ccc] hover:bg-[#2a2a2a] hover:text-white'
        }`}
      >
        <DownloadIcon />
        export
      </button>
    </div>
  )
}

function ToolButton({
  active,
  onClick,
  title,
  children,
  danger,
  accent,
}: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
  danger?: boolean
  accent?: boolean
}) {
  const base = 'w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer'
  let cls = base
  if (active && accent) cls += ' bg-purple-600 text-white'
  else if (active) cls += ' bg-white text-black'
  else if (danger) cls += ' bg-[#1a1a1a] text-[#666] hover:text-red-400 hover:bg-[#2a1a1a]'
  else cls += ' bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2a]'

  return (
    <button className={cls} onClick={onClick} title={title}>
      {children}
    </button>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  )
}

function EraserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 20H7L3 16l13-13 6 6-2 11z" />
      <path d="M6.0001 10L14 18" />
    </svg>
  )
}

function DiceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
