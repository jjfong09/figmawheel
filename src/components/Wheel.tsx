import { useEffect, useRef } from 'react'

type Props = {
  names: string[]
  colors: string[]
  isSpinning: boolean
  rotation: number
  onSpinEnd: (finalRotation: number) => void
  onSpinRequest?: () => void
}

const R = 240        // wheel radius
const CX = 250       // SVG centre x
const CY = 250       // SVG centre y
const LABEL_R = 160  // distance from centre to label mid-point
const TEXT_MAX = 18  // max chars before truncating

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function segmentPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle)
  const e = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// Choose black or white label text based on segment background lightness
function contrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  // Perceived luminance
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? '#111827' : '#ffffff'
}

export function Wheel({ names, colors, rotation, onSpinEnd, onSpinRequest, isSpinning }: Props) {
  const groupRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    const element = groupRef.current
    if (!element) return

    const handleTransitionEnd = () => {
      const computed = getComputedStyle(element)
      const transform = computed.transform
      if (!transform || transform === 'none') {
        onSpinEnd(0)
        return
      }

      const values = transform
        .replace('matrix(', '')
        .replace(')', '')
        .split(',')
        .map((v) => Number.parseFloat(v))

      if (values.length < 4 || Number.isNaN(values[0]) || Number.isNaN(values[1])) {
        onSpinEnd(rotation)
        return
      }

      const [a, b] = values
      const angle = Math.atan2(b, a) * (180 / Math.PI)
      onSpinEnd(angle)
    }

    element.addEventListener('transitionend', handleTransitionEnd)
    return () => element.removeEventListener('transitionend', handleTransitionEnd)
  }, [onSpinEnd, rotation])

  const hasNames = names.length > 0
  const count = hasNames ? names.length : 1
  const segmentAngle = 360 / count

  return (
    <div
      className="wheelShell"
      role="button"
      tabIndex={hasNames ? 0 : -1}
      aria-label={hasNames ? 'Spin the wheel' : 'Wheel'}
      onClick={() => {
        if (!hasNames || isSpinning) return
        onSpinRequest?.()
      }}
      onKeyDown={(event) => {
        if (!hasNames || isSpinning) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSpinRequest?.()
        }
      }}
    >
      <svg
        viewBox="0 0 500 500"
        className="wheelSvg"
        aria-label="Spinning wheel"
      >
        {/* Segmented wheel when there is at least one name */}
        {hasNames && (
          <g
            ref={groupRef}
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 3.6s cubic-bezier(0.17, 0.86, 0.29, 0.99)',
            }}
          >
            {count === 1 ? (
              (() => {
                const name = names[0]
                const color = colors[0]
                const midAngle = -90
                const labelPos = polarToCartesian(CX, CY, LABEL_R, midAngle)
                const textRotate = midAngle - 90

                return (
                  <g key={name}>
                    <circle cx={CX} cy={CY} r={R} fill={color} />
                    {name && (
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill={contrastColor(color)}
                        fontSize={13}
                        fontFamily="'Inter', system-ui, sans-serif"
                        fontWeight="500"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotate}, ${labelPos.x}, ${labelPos.y})`}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {truncate(name, TEXT_MAX)}
                      </text>
                    )}
                  </g>
                )
              })()
            ) : (
              names.map((name, i) => {
                const color = colors[i % colors.length]
                const startAngle = i * segmentAngle
                const endAngle = (i + 1) * segmentAngle
                const midAngle = startAngle + segmentAngle / 2
                const path = segmentPath(CX, CY, R, startAngle, endAngle)

                // Label position
                const labelPos = polarToCartesian(CX, CY, LABEL_R, midAngle)
                // Rotate label so text reads outward from centre
                const textRotate = midAngle - 90

                return (
                  <g key={`${name}-${i}`}>
                    <path d={path} fill={color} />
                    {name && (
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill={contrastColor(color)}
                        fontSize={segmentAngle < 20 ? 9 : segmentAngle < 36 ? 11 : 13}
                        fontFamily="'Inter', system-ui, sans-serif"
                        fontWeight="500"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotate}, ${labelPos.x}, ${labelPos.y})`}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {truncate(name, TEXT_MAX)}
                      </text>
                    )}
                  </g>
                )
              })
            )}
          </g>
        )}

        {/* Empty state text when there are no names */}
        {!hasNames && (
          <text
            x={CX}
            y={CY}
            fill="#9CA3AF"
            fontSize={14}
            fontFamily="'Inter', system-ui, sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Add names to spin the wheel
          </text>
        )}

        {/* Centre hub (only when there are names) */}
        {hasNames && (
          <circle cx={CX} cy={CY} r={28} fill="#ffffff" stroke="#f3f4f6" strokeWidth="2" />
        )}
      </svg>

      {/* Pointer arrow (only when there are names) */}
      {hasNames && <div className="pointer" />}
    </div>
  )
}
