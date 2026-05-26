"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Shield, Zap, MessageSquare } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay for visual effect
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-bg-gradient" />
      <div className="login-bg-grid" />

      <div className="login-container">
        {/* Left - Branding */}
        <div className="login-branding">
          <div className="login-brand-logo">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="login-brand-title">AI Support Console</h1>
          <p className="login-brand-subtitle">
            Intelligent multi-channel customer support powered by AI copilot
          </p>

          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4>Real-time Chat</h4>
                <p>WebSocket-powered live messaging across WhatsApp & Web channels</p>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4>AI Draft Generation</h4>
                <p>Gemini-powered response drafts with configurable tone control</p>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4>Human-in-the-Loop</h4>
                <p>AI suggests, humans decide — full control over every response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your support dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@company.com"
                className="login-input"
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                autoComplete="current-password"
              />
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button type="button" className="login-forgot">Forgot password?</button>
            </div>

            <button
              type="submit"
              className={`login-submit ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="login-spinner" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="login-demo-note">
              <Sparkles className="w-3.5 h-3.5" />
              Demo mode — enter any credentials to proceed
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
