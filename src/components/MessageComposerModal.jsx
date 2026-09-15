import { useState } from "react";
import { Send, X } from "lucide-react";
import { MESSAGE_TEMPLATES } from "../data/messageTemplates";
import "./MessageComposerModal.css";

const RECIPIENT_OPTIONS = [
  { value: "SB", label: "Student Buddy" },
  { value: "HL", label: "Hotline" },
  { value: "RN", label: "Rania" },
];

export default function MessageComposerModal({ open, title, subtitle, onClose, onSend }) {
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("SB");
  const [activeTemplateId, setActiveTemplateId] = useState(null);

  if (!open) return null;

  function applyTemplate(template) {
    setActiveTemplateId(template.id);
    setText(template.body);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim(), recipient);
    reset();
  }

  function reset() {
    setText("");
    setActiveTemplateId(null);
    setRecipient("SB");
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div className="composer-overlay" onClick={handleClose}>
      <div className="composer-modal" onClick={(event) => event.stopPropagation()}>
        <header className="composer-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="icon-round-button" onClick={handleClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </header>

        <div className="composer-body">
          <div className="composer-templates">
            <span className="composer-templates-label">Template</span>
            <div className="composer-template-list">
              {MESSAGE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={
                    activeTemplateId === template.id
                      ? "composer-template-chip active"
                      : "composer-template-chip"
                  }
                  onClick={() => applyTemplate(template)}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="composer-textarea"
              rows={8}
              placeholder="Pilih template di atas, atau tulis pesan bebas..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              autoFocus
            />

            <div className="composer-footer">
              <label className="composer-recipient">
                <span>Kirim ke:</span>
                <select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
                  {RECIPIENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="composer-footer-actions">
                <button type="button" className="text-button" onClick={handleClose}>
                  Batal
                </button>
                <button type="submit" className="outline-button" disabled={!text.trim()}>
                  <Send size={16} />
                  Kirim
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}