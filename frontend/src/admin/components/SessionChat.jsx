// src/components/SessionChat.jsx
import { useState } from "react";
import { texts as t } from "../../texts";
import "../styles/components/SessionChat.css";

export default function SessionChat({ onSend, onClear, disabled = false }) {
  const [text, setText] = useState("");

  const canSend = !disabled && text.trim().length > 0;
  const canClear = !disabled;

  return (
    <div className="session-chat">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.common.chat.inputPlaceholder}
        disabled={disabled}
        className="session-chat__input"
      />

      <button
        type="button"
        disabled={!canSend}
        onClick={() => {
          onSend?.(text.trim());
          setText("");
        }}
        className="session-chat__button session-chat__button-send"
        style={{
          opacity: canSend ? 1 : 0.55,
          cursor: canSend ? "pointer" : "not-allowed",
        }}
      >
        {t.common.chat.send}
      </button>

      <button
        type="button"
        disabled={!canClear}
        onClick={() => {
          onClear?.();
          setText("");
        }}
        className="session-chat__button session-chat__button-clear"
        style={{
          opacity: canClear ? 1 : 0.55,
          cursor: canClear ? "pointer" : "not-allowed",
        }}
      >
        {t.common.chat.clear}
      </button>
    </div>
  );
}
