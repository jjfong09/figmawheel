import { useEffect, useRef } from 'react'

type Props = {
  isOpen: boolean
  nameCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ isOpen, nameCount, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    cancelRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="modalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modalBox">
        <div className="modalContent">
          <h2 className="modalTitle" id="modal-title">Clear all names?</h2>
          <p className="modalBody">
            This will remove{' '}
            <strong>
              {nameCount} {nameCount === 1 ? 'name' : 'names'}
            </strong>{' '}
            from the wheel. This cannot be undone.
          </p>
        </div>
        <div className="modalActions">
          <button
            ref={cancelRef}
            className="modalCancelButton"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="modalConfirmButton"
            type="button"
            onClick={onConfirm}
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
