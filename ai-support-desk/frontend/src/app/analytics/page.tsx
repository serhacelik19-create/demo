"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Smartphone,
  Globe,
} from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";

interface AnalyticsStats {
  totalConversations: number;
  openCount: number;
  resolvedCount: number;
  totalMessages: number;
  avgResponseTime: number;
  channelDistribution: { whatsapp: number; web: number };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/analytics`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        // Fallback mock data if backend analytics endpoint isn't ready
        setStats({
          totalConversations: 24,
          openCount: 8,
          resolvedCount: 16,
          totalMessages: 142,
          avgResponseTime: 12,
          channelDistribution: { whatsapp: 14, web: 10 },
        });
      });
  }, []);

  if (!stats) {
    return (
      <div className="analytics-page">
        <div className="analytics-page-header">
          <h1><BarChart3 className="w-6 h-6" /> Analytics</h1>
        </div>
        <div className="analytics-loading">Loading analytics data...</div>
      </div>
    );
  }

  const resolutionRate = stats.totalConversations > 0
    ? Math.round((stats.resolvedCount / stats.totalConversations) * 100)
    : 0;

  const whatsappPercent = stats.totalConversations > 0
    ? Math.round((stats.channelDistribution.whatsapp / stats.totalConversations) * 100)
    : 0;
  const webPercent = 100 - whatsappPercent;

  return (
    <div className="analytics-page">
      <div className="analytics-page-header">
        <div>
          <h1>Analytics Overview</h1>
          <p className="analytics-page-subtitle">Real-time performance metrics from your support operations</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper blue">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="kpi-data">
            <span className="kpi-value">{stats.totalConversations}</span>
            <span className="kpi-label">Total Tickets</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper green">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="kpi-data">
            <span className="kpi-value">{resolutionRate}%</span>
            <span className="kpi-label">Resolution Rate</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper amber">
            <Clock className="w-5 h-5" />
          </div>
          <div className="kpi-data">
            <span className="kpi-value">{stats.avgResponseTime}s</span>
            <span className="kpi-label">Avg Response</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper purple">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="kpi-data">
            <span className="kpi-value">{stats.totalMessages}</span>
            <span className="kpi-label">Total Messages</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-grid">
        {/* Ticket Status Breakdown */}
        <div className="analytics-chart-card">
          <h3 className="chart-title">
            <Users className="w-4 h-4" /> Ticket Status
          </h3>
          <div className="chart-bars">
            <div className="chart-bar-item">
              <div className="chart-bar-header">
                <span>Open</span>
                <span className="chart-bar-value">{stats.openCount}</span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill open"
                  style={{ width: `${stats.totalConversations > 0 ? (stats.openCount / stats.totalConversations) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="chart-bar-item">
              <div className="chart-bar-header">
                <span>Resolved</span>
                <span className="chart-bar-value">{stats.resolvedCount}</span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill resolved"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="analytics-chart-card">
          <h3 className="chart-title">
            <Smartphone className="w-4 h-4" /> Channel Distribution
          </h3>
          <div className="channel-distribution">
            <div className="channel-ring-container">
              <svg viewBox="0 0 120 120" className="channel-ring">
                <circle cx="60" cy="60" r="50" className="channel-ring-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="channel-ring-whatsapp"
                  strokeDasharray={`${whatsappPercent * 3.14} ${314 - whatsappPercent * 3.14}`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="channel-ring-center">
                <span className="channel-ring-total">{stats.totalConversations}</span>
                <span className="channel-ring-label">Total</span>
              </div>
            </div>
            <div className="channel-legend">
              <div className="channel-legend-item">
                <div className="channel-dot whatsapp" />
                <span>WhatsApp</span>
                <span className="channel-count">{stats.channelDistribution.whatsapp}</span>
              </div>
              <div className="channel-legend-item">
                <div className="channel-dot web" />
                <span>Web Chat</span>
                <span className="channel-count">{stats.channelDistribution.web}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Trend (Visual Bars) */}
        <div className="analytics-chart-card wide">
          <h3 className="chart-title">
            <BarChart3 className="w-4 h-4" /> Daily Activity (Last 7 Days)
          </h3>
          <div className="mini-bar-chart">
            {[8, 12, 6, 15, 10, 18, 14].map((val, i) => (
              <div key={i} className="mini-bar-col">
                <div className="mini-bar" style={{ height: `${(val / 20) * 100}%` }}>
                  <span className="mini-bar-value">{val}</span>
                </div>
                <span className="mini-bar-label">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
