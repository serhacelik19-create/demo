"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Key,
  Palette,
  Save,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    name: "Support Agent",
    email: "agent@company.com",
    role: "Senior Support Engineer",
  });

  const [notifications, setNotifications] = useState({
    newTickets: true,
    ticketResolved: true,
    aiDrafts: false,
    sound: true,
  });

  const [apiKey, setApiKey] = useState("••••••••••••••••••••");

  const handleSaveProfile = () => {
    addToast("Profile saved successfully", "success");
  };

  const handleSaveNotifications = () => {
    addToast("Notification preferences updated", "success");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="settings-subtitle">Manage your account, preferences, and integrations</p>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <User className="w-5 h-5" />
            <h3>Profile</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="settings-input"
              />
            </div>
            <div className="settings-field">
              <label>Role</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="settings-input"
              />
            </div>
            <button onClick={handleSaveProfile} className="settings-save-btn">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell className="w-5 h-5" />
            <h3>Notifications</h3>
          </div>
          <div className="settings-card-body">
            {[
              { key: "newTickets" as const, label: "New ticket alerts" },
              { key: "ticketResolved" as const, label: "Ticket resolved notifications" },
              { key: "aiDrafts" as const, label: "AI draft ready alerts" },
              { key: "sound" as const, label: "Sound notifications" },
            ].map((item) => (
              <div key={item.key} className="settings-toggle-row">
                <span>{item.label}</span>
                <button
                  onClick={() =>
                    setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                  }
                  className={`settings-toggle ${notifications[item.key] ? "active" : ""}`}
                >
                  <div className="settings-toggle-thumb" />
                </button>
              </div>
            ))}
            <button onClick={handleSaveNotifications} className="settings-save-btn">
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>

        {/* API Configuration */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Key className="w-5 h-5" />
            <h3>API Configuration</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label>Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="settings-input"
              />
              <span className="settings-hint">Used for AI draft generation via Google Gemini</span>
            </div>
            <div className="settings-field">
              <label>Backend URL</label>
              <input
                type="text"
                value="http://localhost:5002"
                readOnly
                className="settings-input readonly"
              />
              <span className="settings-hint">WebSocket server endpoint</span>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Palette className="w-5 h-5" />
            <h3>Appearance</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-theme-selector">
              <button
                onClick={() => { if (theme !== "dark") toggleTheme(); }}
                className={`settings-theme-option ${theme === "dark" ? "active" : ""}`}
              >
                <div className="theme-preview dark-preview">
                  <div className="theme-preview-bar" />
                  <div className="theme-preview-content">
                    <div className="theme-preview-sidebar" />
                    <div className="theme-preview-main" />
                  </div>
                </div>
                <span>Dark Mode</span>
                {theme === "dark" && <CheckCircle className="w-4 h-4 theme-check" />}
              </button>

              <button
                onClick={() => { if (theme !== "light") toggleTheme(); }}
                className={`settings-theme-option ${theme === "light" ? "active" : ""}`}
              >
                <div className="theme-preview light-preview">
                  <div className="theme-preview-bar" />
                  <div className="theme-preview-content">
                    <div className="theme-preview-sidebar" />
                    <div className="theme-preview-main" />
                  </div>
                </div>
                <span>Light Mode</span>
                {theme === "light" && <CheckCircle className="w-4 h-4 theme-check" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
