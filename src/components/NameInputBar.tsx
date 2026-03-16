type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onAddMultiple: (names: string[]) => void
  disabled?: boolean
}

export function NameInputBar({ value, onChange, onSubmit, onAddMultiple, disabled }: Props) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = event.clipboardData.getData('text')
    const lines = pasted
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length > 1) {
      event.preventDefault()
      onAddMultiple(lines)
    }
  }

  return (
    <div className="nameInputBar">
      <label className="fieldLabel" htmlFor="name-input">
        Add a name
      </label>
      <div className="inputRow">
        <textarea
          id="name-input"
          className="nameTextarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Type a name and press Enter"
          disabled={disabled}
          rows={1}
        />
        <button
          className="secondaryButton"
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        >
          Add
        </button>
      </div>
    </div>
  )
}
