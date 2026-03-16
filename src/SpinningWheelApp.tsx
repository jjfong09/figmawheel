import { useCallback, useEffect, useMemo, useState } from 'react'
import { NameInputBar } from './components/NameInputBar'
import { ConfirmModal } from './components/ConfirmModal'
import { WinnerModal } from './components/WinnerModal'
import { Wheel } from './components/Wheel'
import { CornerArt } from './components/CornerArt'
import './styles.css'

// Brand palette from the provided Figma spec
const PALETTE = [
  '#4A90FC', // Blue
  '#00B6FF', // Cyan
  '#045C35', // Dark Green
  '#24C67B', // Kelly Green
  '#76FF7F', // Neon Green
  '#F4FF97', // Lime
  '#A4FFE3', // Mint
  '#B89600', // Gold
  '#8F24FF', // Purple
  '#C8B9F2', // Dusty Violet
  '#BF8AFF', // Twinkle
  '#742C1C', // Maroon
  '#FF3737', // Hot Red
  '#FF7F37', // Orange
  '#FF0F93', // Hot Pink
  '#FFC5CF', // Peach
  '#B7847A', // Brown
]

export function SpinningWheelApp() {
  const [names, setNames] = useState<string[]>([])
  const [namesText, setNamesText] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [winnerName, setWinnerName] = useState<string | null>(null)

  const handleNamesTextChange = useCallback((text: string) => {
    setNamesText(text)
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
    setNames(lines)
  }, [])

  const shuffleNames = useCallback(() => {
    setNames((prev) => {
      const arr = [...prev]
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      setNamesText(arr.join('\n'))
      return arr
    })
  }, [])

  const clearAll = useCallback(() => {
    setNames([])
    setNamesText('')
    setRotation(0)
  }, [])

  const canSpin = useMemo(() => names.length > 0 && !isSpinning, [names.length, isSpinning])

  const handleSpin = useCallback(() => {
    if (!canSpin) return
    const count = names.length
    const targetIndex = Math.floor(Math.random() * count)
    const segmentAngle = 360 / count
    const extraTurns = 5 + Math.floor(Math.random() * 4) // 5–8 full spins
    const targetAngle = extraTurns * 360 - (targetIndex * segmentAngle + segmentAngle / 2)

    setIsSpinning(true)
    setRotation((prev) => prev + targetAngle)
  }, [canSpin, names.length])

  const handleSpinEnd = useCallback(
    (finalAngle: number) => {
      if (!names.length) {
        setIsSpinning(false)
        return
      }
      const normalized = ((-finalAngle % 360) + 360) % 360
      const segmentAngle = 360 / names.length
      const index = Math.floor(normalized / segmentAngle)
      setWinnerName(names[index])
      setShowWinnerModal(true)
      setIsSpinning(false)
    },
    [names],
  )

  // gentle idle rotation when not spinning and there are names
  useEffect(() => {
    if (isSpinning || names.length === 0) return

    const idleSpeed = 0.15 // degrees per tick
    const interval = window.setInterval(() => {
      setRotation((prev) => prev + idleSpeed)
    }, 50)

    return () => window.clearInterval(interval)
  }, [isSpinning, names.length])

  return (
    <div className="page">
      <div className="layout">
        <div className="leftColumn">
          <header className="header">
            <h1 className="title">Spin the wheel!</h1>
            <p className="subtitle pill">Get ready to win some Figma swag!</p>
          </header>

          <div className="card">
            <NameInputBar
              value={namesText}
              onChange={handleNamesTextChange}
              onShuffle={shuffleNames}
              onClearRequest={() => setShowClearModal(true)}
              disabled={isSpinning}
            />

            <div className="actionsRow">
              <button
                className="primaryButton"
                type="button"
                onClick={handleSpin}
                disabled={!canSpin}
              >
                Spin
              </button>
            </div>
          </div>
        </div>

        <div className="rightColumn">
          <Wheel
            names={names}
            colors={PALETTE}
            isSpinning={isSpinning}
            rotation={rotation}
            onSpinEnd={handleSpinEnd}
            onSpinRequest={handleSpin}
          />
        </div>
      </div>

      <CornerArt />

      <ConfirmModal
        isOpen={showClearModal}
        nameCount={names.length}
        onConfirm={() => {
          clearAll()
          setShowClearModal(false)
        }}
        onCancel={() => setShowClearModal(false)}
      />

      <WinnerModal
        isOpen={showWinnerModal}
        winnerName={winnerName}
        onClose={() => setShowWinnerModal(false)}
        onRemove={() => {
          if (!winnerName) return
          setNames((prev) => {
            const next = prev.filter((name) => name !== winnerName)
            setNamesText(next.join('\n'))
            return next
          })
          setShowWinnerModal(false)
          setWinnerName(null)
        }}
      />

      <div className="footer">
        <span>Built by UC Davis Figma Campus Leaders</span>
      </div>
    </div>
  )
}

