import { useMemo, useState } from 'react'
import './App.css'

/**
 * Utility: Convert hex color string to RGB object.
 * Supports formats like "#RRGGBB" or "RRGGBB".
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

/**
 * Utility: Calculate relative luminance (WCAG).
 */
function relativeLuminance({ r, g, b }) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/**
 * Utility: Choose black or white text color for best contrast against the given hex background.
 */
function getContrastColor(hex) {
  const lum = relativeLuminance(hexToRgb(hex))
  return lum > 0.5 ? '#000000' : '#FFFFFF'
}

/**
 * Utility: Shade (lighten/darken) a hex color by percent (-100 to 100).
 * Positive values lighten, negative darken.
 */
function shadeColor(hex, percent) {
  const { r, g, b } = hexToRgb(hex)
  const t = percent < 0 ? 0 : 255
  const p = Math.abs(percent) / 100
  const R = Math.round((t - r) * p + r)
  const G = Math.round((t - g) * p + g)
  const B = Math.round((t - b) * p + b)
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(R)}${toHex(G)}${toHex(B)}`
}

function App() {
  const colors = [
    { name: 'Red', code: '#FF0000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Purple', code: '#800080' },
    { name: 'Olive', code: '#808000' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Cyan', code: '#00FFFF' },
    { name: 'Brown', code: '#A52A2A' }
  ]

  const defaultColor = colors.find(c => c.name === 'Olive') || colors[0]
  const [selected, setSelected] = useState(defaultColor)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)

  // Filter colors by name
  const filteredColors = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return colors
    return colors.filter(c => c.name.toLowerCase().includes(q))
  }, [query, colors])

  const textOnSelected = getContrastColor(selected.code)

  // Background gradient using the selected color
  const bg1 = shadeColor(selected.code, 30)
  const bg2 = shadeColor(selected.code, -40)
  const glow1 = shadeColor(selected.code, 45)
  const glow2 = shadeColor(selected.code, -20)
  const backgroundStyle = {
    background: `
      radial-gradient(1200px 600px at 20% 10%, ${glow1}33 0%, transparent 60%),
      radial-gradient(900px 500px at 80% 30%, ${glow2}33 0%, transparent 60%),
      linear-gradient(135deg, ${bg1}, ${bg2})
    `,
    transition: 'background 500ms ease'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  const handleRandom = () => {
    const idx = Math.floor(Math.random() * colors.length)
    setSelected(colors[idx])
  }

  return (
    <div className="w-full min-h-screen overflow-hidden" style={backgroundStyle}>
      {/* Center everything within the viewport */}
      <div className="max-w-6xl mx-auto min-h-screen px-6 py-8 flex flex-col items-center justify-center gap-8">
        {/* Header card */}
        <div className="flex items-center gap-4 rounded-3xl px-8 py-4 shadow-2xl bg-black/30 backdrop-blur-md">
          <div
            className="h-12 w-12 rounded-xl ring-2 ring-white/50 shadow-lg"
            style={{ backgroundColor: selected.code }}
          />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-3xl md:text-4xl font-bold text-white tracking-wider">
              {selected.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-white/90 text-lg font-mono">{selected.code}</span>
              <button
                onClick={handleCopy}
                className="text-white/90 hover:text-white px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                title="Copy hex code"
              >
                {copied ? 'Copied!' : 'Copy HEX'}
              </button>
            </div>
          </div>
        </div>

        {/* Big centered title */}
        <div
          className="px-10 py-6 rounded-3xl shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: textOnSelected === '#000000' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
          }}
        >
          <h1
            className="text-5xl md:text-7xl font-black tracking-wider text-center"
            style={{ color: textOnSelected }}
          >
            {selected.name.toUpperCase()}
          </h1>
        </div>

        {/* Controls centered */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colors..."
              className="w-full sm:w-80 px-6 py-3 rounded-full bg-white/80 text-lg placeholder:text-gray-500 text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              onClick={() => setQuery('')}
              className="px-5 py-3 rounded-full bg-white/40 text-gray-800 hover:bg-white/60 transition-all hover:scale-105 active:scale-95"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRandom}
              className="px-6 py-3 rounded-full bg-black/30 text-white hover:bg-black/40 transition-all hover:scale-105 active:scale-95 shadow-lg text-lg"
            >
              Random Color
            </button>
            <button
              onClick={() => setSelected(defaultColor)}
              className="px-6 py-3 rounded-full bg-white/30 text-gray-900 hover:bg-white/50 transition-all hover:scale-105 active:scale-95 shadow-lg text-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Palette centered */}
        <div className="w-full">
          <div className="mx-auto w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 px-6 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[30vh] overflow-y-auto pr-2">
              {filteredColors.map((clr) => {
                const isActive = clr.name === selected.name
                const swatchText = getContrastColor(clr.code)
                return (
                  <button
                    key={clr.name}
                    onClick={() => setSelected(clr)}
                    title={`${clr.name} (${clr.code})`}
                    className={[
                      'relative outline-none px-5 py-2.5 rounded-full shadow-lg transition-all',
                      'hover:scale-110 hover:shadow-xl active:scale-95'
                    ].join(' ')}
                    style={{
                      backgroundColor: clr.code,
                      color: swatchText,
                      boxShadow: isActive
                        ? '0 0 0 3px rgba(255,255,255,0.85), 0 10px 15px -3px rgba(0,0,0,0.3)'
                        : undefined
                    }}
                  >
                    <span className="font-medium">{clr.name}</span>
                    {isActive && (
                      <span
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white"
                        style={{ backgroundColor: swatchText === '#000000' ? '#ffffff' : '#000000' }}
                        aria-hidden
                      />
                    )}
                  </button>
                )
              })}
              {filteredColors.length === 0 && (
                <div className="text-white/90 text-sm py-6 col-span-full text-center">
                  No colors match “{query}”
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App