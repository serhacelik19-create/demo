"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, LogOut, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ToastProvider } from "@/components/ui/Toast";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <div className="dashboard-layout">
        {/* Top Navigation Bar */}
        <nav className="top-nav">
          <div className="top-nav-left">
            <div className="top-nav-brand">
              <Sparkles className="w-5 h-5 nav-brand-icon" />
              <span className="nav-brand-text notranslate">SupportDesk AI</span>
            </div>

            <div className="top-nav-links">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`top-nav-link ${isActive ? "active" : ""}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="top-nav-right">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="nav-user-avatar notranslate">SA</div>
            <Link href="/login" className="top-nav-link nav-logout">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
