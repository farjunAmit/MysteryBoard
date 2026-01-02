// src/components/ChatSender.jsx
import { useState } from "react";
import { texts as t } from "../../texts";

export default function ChatSender({ onSend,onClear, disabled = false }) {
  const [text, setText] = useState("");

  const canSend = !disabled && text.trim().length > 0;
  const canClear = !disabled
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.common.chat.inputPlaceholder}
        disabled={disabled}
      />

      <button
        type="button"
        disabled={!canSend}
        onClick={() => {
          onSend?.(text.trim());
          setText("");
        }}
      >
        {t.common.chat.send}
      </button>
      <button
        type="button"
        disabled={!canClear}
        onClick={()=>{
          onClear?.();
          setText("");
        }}
        >
          {t.common.chat.clear}
        </button>
    </div>
  );
}
