type Props = {
  value: string
  onChange: (value: string) => void
  onShuffle: () => void
  onClearRequest: () => void
  disabled?: boolean
}

export function NameInputBar({ value, onChange, onShuffle, onClearRequest, disabled }: Props) {
  return (
    <div className="nameInputBar">
      <div className="nameListHeader">
        <label className="fieldLabel" htmlFor="name-input">
          Add names
        </label>
        <div className="headerIcons">
          <button
            className="iconButton"
            type="button"
            onClick={onShuffle}
            disabled={disabled}
            aria-label="Shuffle names"
            title="Shuffle names"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>
          <button
            className="iconButton danger"
            type="button"
            onClick={onClearRequest}
            disabled={disabled}
            aria-label="Clear all names"
            title="Clear all names"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="inputRow">
        <textarea
          id="name-input"
          className="nameTextarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type names (one per line)"
          disabled={disabled}
          rows={3}
        />
      </div>
    </div>
  )
}
