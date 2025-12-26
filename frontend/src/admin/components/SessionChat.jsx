// src/components/ChatSender.jsx
import { useState } from "react";

export default function ChatSender({ onSend, disabled = false }) {
  const [text, setText] = useState("");

  const canSend = !disabled && text.trim().length > 0;

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />

      <button
        type="button"
        disabled={!canSend}
        onClick={() => {
          onSend?.(text.trim());
          setText("");
        }}
      >
        Send
      </button>
    </div>
  );
}
