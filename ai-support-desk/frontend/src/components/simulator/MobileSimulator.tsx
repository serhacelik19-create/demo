"use client";

import React, { useState } from "react";
import { Smartphone, SendHorizonal, Info } from "lucide-react";
import { Customer } from "@/lib/types";

interface MobileSimulatorProps {
  customer: Customer;
  onSendMessage: (content: string) => void;
}

export default function MobileSimulator({ customer, onSendMessage }: MobileSimulatorProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="mobile-widget-container">
      <div className="mobile-widget-card">
        <div className="mobile-widget-header">
          <div className="mobile-widget-header-left">
            <Smartphone className="w-3.5 h-3.5" />
            <span className="mobile-widget-title">{customer.name}</span>
          </div>
          <div className="mobile-widget-status" />
        </div>

        <div className="mobile-widget-body">
          <div className="mobile-widget-info">
            <Info className="w-3.5 h-3.5 mobile-info-icon" />
            <span>Simulate a customer response in real-time</span>
          </div>

          <form onSubmit={handleSubmit} className="mobile-widget-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send as ${customer.name.split(" ")[0]}...`}
              className="mobile-widget-input"
            />
            <button type="submit" disabled={!message.trim()} className="mobile-widget-send-btn">
              <SendHorizonal className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
