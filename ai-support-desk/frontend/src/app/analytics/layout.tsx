"use client";

import { useTheme } from "@/hooks/useTheme";
import { ToastProvider } from "@/components/ui/Toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, LogOut, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <div className="dashboard-layout">
        <nav className="top-nav">
          <div className="top-nav-left">
            <div className="top-nav-brand">
              <Sparkles className="w-5 h-5 nav-brand-icon" />
              <span className="nav-brand-text notranslate">SupportDesk AI</span>
            </div>
            <div className="top-nav-links">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`top-nav-link ${pathname === item.href ? "active" : ""}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
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
        <div className="dashboard-content">{children}</div>
      </div>
    </ToastProvider>
  );
}
