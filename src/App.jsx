import { useEffect, useMemo, useState } from 'react'
import './App.css'
import 'tailwindcss/tailwind.css'
import './index.css'

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

function relativeLuminance({ r, g, b }) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}


function getContrastColor(hex) {
  const lum = relativeLuminance(hexToRgb(hex))
  return lum > 0.5 ? '#000000' : '#FFFFFF'
}


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

function useResponsiveCols() {
  const [cols, setCols] = useState(5)

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)')
    const mqSm = window.matchMedia('(min-width: 640px)')

    const update = () => {
      if (mqLg.matches) setCols(5)
      else if (mqSm.matches) setCols(3)
      else setCols(2)
    }

    update()
    mqLg.addEventListener?.('change', update)
    mqSm.addEventListener?.('change', update)
    return () => {
      mqLg.removeEventListener?.('change', update)
      mqSm.removeEventListener?.('change', update)
    }
  }, [])

  return cols
}

function chunkArray(arr, size) {
  if (size <= 0) return [arr]
  const out = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
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

  // Rows layout
  const cols = useResponsiveCols()
  const rows = useMemo(() => chunkArray(filteredColors, cols), [filteredColors, cols])

  return (
    <div className="full-screen center-screen overflow-hidden bg-animated" style={backgroundStyle}>
      {/* App container centered */}
      <div className="app-container stack-center gap-8">
        {/* Header card */}
        <div className="card card-dark elev-2 float-in center gap-4">
          <div
            className="h-12 w-12 rounded-xl ring-2 ring-white/50 shadow-lg glow-ring"
            style={{ backgroundColor: selected.code }}
            aria-hidden
          />
          <div className="stack items-center sm:items-start text-center sm:text-left">
            <span className="title responsive-text text-white tracking-wider">
              {selected.name}
            </span>
            <div className="row">
              <span className="text-white/90 font-mono">{selected.code}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="pill button-hover"
                title="Copy hex code"
                aria-live="polite"
              >
                {copied ? 'Copied!' : 'Copy HEX'}
              </button>
            </div>
          </div>
        </div>

        {/* Big centered title */}
        <div
          className="card elev-3 glass-morphism"
          style={{
            backgroundColor:
              textOnSelected === '#000000' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
          }}
        >
          <h1
            className="title title-text text-center text-shadow-soft"
            style={{ color: textOnSelected }}
          >
            {selected.name.toUpperCase()}
          </h1>
        </div>

        {/* Controls */}
        <div className="stack-center gap-4 w-full">
          <div className="row flex-wrap justify-center w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colors..."
              className="input input-ghost w-full sm:w-80"
              aria-label="Search colors"
            />
            <button
              type="button"
              onClick={() => setQuery('')}
              className="btn btn-secondary button-hover"
              title="Clear search"
            >
              Clear
            </button>
          </div>
          <div className="row justify-center">
            <button
              type="button"
              onClick={handleRandom}
              className="btn btn-primary button-hover"
              title="Pick a random color"
            >
              Random Color
            </button>
            <button
              type="button"
              onClick={() => setSelected(defaultColor)}
              className="btn btn-secondary button-hover"
              title="Reset to default"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Palette - arranged in rows */}
        <div className="w-full">
          <div className="card elev-2">
            <div className="stack gap-3 maxh-30vh pr-2" role="list">
              {filteredColors.length === 0 && (
                <div className="muted text-white/90 text-sm py-6 text-center">
                  No colors match “{query}”
                </div>
              )}

              {rows.map((row, rIdx) => (
                <div
                  key={`row-${rIdx}`}
                  className="row justify-center gap-3"
                  role="group"
                  aria-label={`Row ${rIdx + 1}`}
                >
                  {row.map((clr) => {
                    const isActive = clr.name === selected.name
                    const swatchText = getContrastColor(clr.code)
                    return (
                      <button
                        key={clr.name}
                        type="button"
                        onClick={() => setSelected(clr)}
                        title={`${clr.name} (${clr.code})`}
                        aria-pressed={isActive}
                        role="listitem"
                        className={['swatch color-item', isActive ? 'is-active' : ''].join(' ')}
                        style={{
                          backgroundColor: clr.code,
                          color: swatchText
                        }}
                      >
                        <span className="font-medium">{clr.name}</span>
                        {isActive && (
                          <span
                            className="inline-block ml-2 h-2.5 w-2.5 rounded-full ring-2 ring-white align-middle"
                            style={{ backgroundColor: swatchText === '#000000' ? '#ffffff' : '#000000' }}
                            aria-hidden
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App