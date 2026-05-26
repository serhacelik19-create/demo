"use client";

import { MessageSquare, Zap, CircleDot, Search } from "lucide-react";
import { Conversation, SidebarTab } from "@/lib/types";
import TicketItem from "./TicketItem";
import Skeleton from "@/components/ui/Skeleton";

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  sidebarTab: SidebarTab;
  isConnected: boolean;
  searchQuery: string;
  onSelectTicket: (id: string) => void;
  onTabChange: (tab: SidebarTab) => void;
  onTriggerSimulator: () => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export default function Sidebar({
  conversations,
  selectedId,
  sidebarTab,
  isConnected,
  searchQuery,
  onSelectTicket,
  onTabChange,
  onTriggerSimulator,
  onSearchChange,
  isLoading,
}: SidebarProps) {
  const filteredByTab = conversations.filter((c) =>
    sidebarTab === "open"
      ? c.status === "open" || c.status === "pending"
      : c.status === "resolved"
  );

  const openCount = conversations.filter((c) => c.status === "open" || c.status === "pending").length;
  const resolvedCount = conversations.filter((c) => c.status === "resolved").length;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-section">
          <div className="brand-logo">CS</div>
          <div className="brand-title notranslate">Support Console</div>
        </div>

        <div className="connection-status">
          <CircleDot className={`w-3 h-3 ${isConnected ? "status-online" : "status-offline"}`} />
          <span>{isConnected ? "Live" : "Offline"}</span>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search className="sidebar-search-icon" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sidebar-search-input"
        />
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          onClick={() => onTabChange("open")}
          className={`sidebar-tab-btn ${sidebarTab === "open" ? "active" : ""}`}
        >
          <span>Open</span>
          <span className="sidebar-tab-count">{openCount}</span>
        </button>
        <button
          onClick={() => onTabChange("resolved")}
          className={`sidebar-tab-btn ${sidebarTab === "resolved" ? "active" : ""}`}
        >
          <span>Resolved</span>
          <span className="sidebar-tab-count">{resolvedCount}</span>
        </button>
      </div>

      {/* Ticket List */}
      <div className="customer-list">
        {isLoading ? (
          <div className="skeleton-ticket-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-ticket-item">
                <Skeleton variant="avatar" width="42px" height="42px" />
                <div className="skeleton-ticket-info">
                  <Skeleton variant="text" width="70%" height="14px" />
                  <Skeleton variant="text" width="90%" height="12px" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredByTab.length === 0 ? (
          <div className="empty-state">
            <MessageSquare className="empty-state-icon w-10 h-10" />
            <p className="empty-state-text">No {sidebarTab} tickets found</p>
          </div>
        ) : (
          filteredByTab.map((conv) => (
            <TicketItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onSelect={onSelectTicket}
            />
          ))
        )}
      </div>

      {/* Simulator Trigger */}
      <div className="simulator-panel">
        <button
          onClick={onTriggerSimulator}
          className="simulator-trigger-btn"
        >
          <Zap className="w-4 h-4 simulator-zap-icon" />
          <span>Trigger Mock Ticket</span>
        </button>
      </div>
    </aside>
  );
}
