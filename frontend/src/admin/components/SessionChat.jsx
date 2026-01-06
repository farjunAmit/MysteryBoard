// src/components/ChatSender.jsx
import { useState } from "react";
import { texts as t } from "../../texts";

export default function ChatSender({ onSend, onClear, disabled = false }) {
  const [text, setText] = useState("");

  const canSend = !disabled && text.trim().length > 0;
  const canClear = !disabled;
  return (
    <div style={chatStyles.container}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.common.chat.inputPlaceholder}
        disabled={disabled}
        style={chatStyles.input}
      />

      <button
        type="button"
        disabled={!canSend}
        onClick={() => {
          onSend?.(text.trim());
          setText("");
        }}
        style={{
          ...chatStyles.button,
          ...chatStyles.sendButton,
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
        style={{
          ...chatStyles.button,
          ...chatStyles.clearButton,
          opacity: canClear ? 1 : 0.55,
          cursor: canClear ? "pointer" : "not-allowed",
        }}
      >
        {t.common.chat.clear}
      </button>
    </div>
  );
}

const chatStyles = {
  container: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
    padding: 14,
    border: "1px solid #1F3448",
    borderRadius: 12,
    backgroundColor: "#162635",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #1F3448",
    backgroundColor: "#13212E",
    color: "#EDEDED",
    fontSize: 13,
    outline: "none",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  },
  sendButton: {
    border: "1px solid #C9A24D",
    backgroundColor: "#C9A24D",
    color: "#0B0F14",
  },
  clearButton: {
    border: "1px solid rgba(227,91,91,0.5)",
    backgroundColor: "transparent",
    color: "#E35B5B",
  },
};
