import "../styles/ui/Modal.css";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-header__title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-header__close"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
