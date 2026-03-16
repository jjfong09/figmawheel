import { useEffect } from 'react'
import confetti from 'canvas-confetti'

type Props = {
  isOpen: boolean
  winnerName: string | null
  onClose: () => void
  onRemove: () => void
}

export function WinnerModal({ isOpen, winnerName, onClose, onRemove }: Props) {
  useEffect(() => {
    if (!isOpen) return

    const defaults = { startVelocity: 25, spread: 360, ticks: 80, zIndex: 9999 }

    // single burst from left
    confetti({
      ...defaults,
      particleCount: 120,
      origin: { x: 0.2, y: 0.3 },
    })

    // and from right
    confetti({
      ...defaults,
      particleCount: 120,
      origin: { x: 0.8, y: 0.3 },
    })
  }, [isOpen])

  if (!isOpen || !winnerName) return null

  return (
    <div
      className="modalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <div className="modalBox winnerBox">
        <div className="modalContent">
          <h2 className="modalTitle" id="winner-title">
            We have a winner!
          </h2>
          <p className="winnerName">{winnerName}</p>
        </div>
        <div className="modalActions">
          <button className="modalCancelButton" type="button" onClick={onClose}>
            Close
          </button>
          <button className="modalConfirmButton" type="button" onClick={onRemove}>
            Remove from wheel
          </button>
        </div>
      </div>
    </div>
  )
}

