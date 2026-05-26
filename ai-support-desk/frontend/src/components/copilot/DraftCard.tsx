"use client";

import { useState } from "react";
import { RefreshCw, Zap, Copy, Check, Sparkles } from "lucide-react";
import { Message } from "@/lib/types";
import { TONE_OPTIONS } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";

interface DraftCardProps {
  lastCustomerMessage: Message | null;
  isGenerating: boolean;
  onRedraft: (tone: string) => void;
  onApply: (draft: string) => void;
  onSendDirect: (content: string) => void;
}

export default function DraftCard({
  lastCustomerMessage,
  isGenerating,
  onRedraft,
  onApply,
  onSendDirect,
}: DraftCardProps) {
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleToneChange = (tone: string) => {
    setSelectedTone(tone);
    onRedraft(tone);
  };

  const handleCopy = (draft: string) => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    addToast("Draft copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!lastCustomerMessage) {
    return (
      <div className="copilot-empty">
        <Sparkles className="w-8 h-8 copilot-empty-icon" />
        <span>Select an active conversation to engage the AI Copilot.</span>
      </div>
    );
  }

  return (
    <div className={`copilot-card ${isGenerating ? "loading" : ""}`}>
      <div className="copilot-card-header">
        <span className="copilot-badge notranslate">Draft Response</span>

        <div className="tone-selector-inline">
          <span className="tone-label">Tone:</span>
          <select
            value={selectedTone}
            onChange={(e) => handleToneChange(e.target.value)}
            className="tone-select"
          >
            {TONE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isGenerating ? (
        <div className="draft-box draft-loading">
          <RefreshCw className="w-4 h-4 animate-spin draft-spinner" />
          Generating tailored draft reply...
        </div>
      ) : lastCustomerMessage.draftReply ? (
        <>
          <div className="draft-box">{lastCustomerMessage.draftReply}</div>
          <div className="draft-actions">
            <button
              onClick={() => onApply(lastCustomerMessage.draftReply!)}
              className="btn-draft-apply"
            >
              <Zap className="w-4 h-4" />
              Apply to Input
            </button>
            <button
              onClick={() => onSendDirect(lastCustomerMessage.draftReply!)}
              className="btn-draft-send"
            >
              Send Direct
            </button>
            <button
              onClick={() => handleCopy(lastCustomerMessage.draftReply!)}
              className="btn-draft-copy"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 copy-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </>
      ) : (
        <div className="draft-box draft-waiting">
          Waiting for next customer message...
        </div>
      )}
    </div>
  );
}
