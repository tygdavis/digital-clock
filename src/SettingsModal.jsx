import { useEffect, useRef } from "react";

export default function SettingsModal({ is24h, onChangeIs24h, onClose }) {
  const dialogRef = useRef(null);
  const pressedOnOverlayRef = useRef(false);

  // ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Record if pointer started on the overlay (not inside the dialog)
  function handleOverlayPointerDown(e) {
    const startedInsideDialog = dialogRef.current?.contains(e.target) ?? false;
    pressedOnOverlayRef.current = !startedInsideDialog;
  }

  // Close only if pointer also ends on the overlay
  function handleOverlayPointerUp(e) {
    const endedOnOverlay = e.target === e.currentTarget;
    if (pressedOnOverlayRef.current && endedOnOverlay) {
      onClose();
    }
    pressedOnOverlayRef.current = false;
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      aria-hidden="true"
      onPointerDown={handleOverlayPointerDown}
      onPointerUp={handleOverlayPointerUp}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal-header">
          <h2 id="settings-title">Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="row" htmlFor="is24h">
            <input
              id="is24h"
              type="checkbox"
              checked={is24h}
              onChange={(e) => onChangeIs24h(e.target.checked)}
            />
            <span>Use 24-hour time</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
