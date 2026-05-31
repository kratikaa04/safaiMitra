import { useState, useEffect, useCallback } from "react";

// ─── API (connects to SafaiMitra backend at localhost:5000) ───────────────────
const BASE_URL = "http://localhost:5000";

async function fetchWasteData() {
  const res = await fetch(`${BASE_URL}/api/waste`);

  if (!res.ok) {
    throw new Error("Failed to fetch waste data");
  }

  return res.json();
}

async function fetchCityData() {
  const res = await fetch(`${BASE_URL}/api/cities`);

  if (!res.ok) {
    throw new Error("Failed to fetch city data");
  }

  return res.json();
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const colors = {
  green:  { bg: "#e6f5ec", icon: "#1a7a45", border: "#b6dfc5", text: "#0f5030" },
  orange: { bg: "#fff3e6", icon: "#c25c00", border: "#ffd0a0", text: "#7a3900" },
  blue:   { bg: "#e6f0fb", icon: "#1a5fa8", border: "#b3d0f0", text: "#103c6e" },
  purple: { bg: "#f0ecfc", icon: "#6233c0", border: "#cdbfee", text: "#3b1f80" },
};

const font = "'Poppins', sans-serif";

// ─── ICONS (SVG, 28px) ────────────────────────────────────────────────────────
const IconDisposal = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v5M14 11v5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconReward = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/>
    <path d="M12 12v9M9 18h6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 15l-3 3M17 15l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconHistory = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
    <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCity = ({ color }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 21h18M9 21V8l6-3v16" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21V12l6-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="10" y="11" width="2" height="3" rx="0.5" stroke={color} strokeWidth="1.4"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconAdmin = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l3 6.5H22l-5.5 4 2 6.5L12 15l-6.5 4 2-6.5L2 8.5h7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const IconHelp = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M9.5 9.5C9.5 8.1 10.6 7 12 7s2.5 1.1 2.5 2.5c0 2-2.5 2.5-2.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const IconAbout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconContact = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M2 9l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconLock = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#e24b4a" strokeWidth="1.8"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#e24b4a" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconTrophy = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 2h12v8a6 6 0 0 1-12 0z" stroke="#c25c00" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M6 5H3v3a3 3 0 0 0 3 3M18 5h3v3a3 3 0 0 1-3 3" stroke="#c25c00" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 16v4M8 20h8" stroke="#c25c00" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${font}; background: #f4f5f7; color: #1a1a2e; }
  
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar {
    width: 240px; min-width: 240px; background: #0f1b2d;
    display: flex; flex-direction: column;
    padding: 0 0 24px; transition: width 0.25s ease;
    position: relative; z-index: 10;
  }
  .sidebar.collapsed { width: 64px; min-width: 64px; }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 22px 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .logo-mark {
    width: 32px; height: 32px; min-width: 32px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
  }
  .logo-mark svg { width: 18px; height: 18px; }
  .logo-text {
    font-size: 14px; font-weight: 600; color: #fff;
    letter-spacing: 0.3px; white-space: nowrap; overflow: hidden;
  }
  .logo-text span { color: #22c55e; }
  .sidebar-section { padding: 20px 12px 8px; }
  .sidebar-label {
    font-size: 10px; font-weight: 600; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    padding: 0 8px 8px; white-space: nowrap; overflow: hidden;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px; cursor: pointer;
    color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 400;
    transition: all 0.15s; white-space: nowrap; overflow: hidden;
    user-select: none;
  }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .nav-item.active { background: rgba(34,197,94,0.15); color: #22c55e; font-weight: 500; }
  .nav-icon { min-width: 17px; display: flex; align-items: center; justify-content: center; }
  .sidebar-spacer { flex: 1; }
  .sidebar-bottom { padding: 0 12px; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 16px; margin-top: 16px; }
  .collapse-btn {
    position: absolute; top: 24px; right: -12px;
    width: 24px; height: 24px; background: #1e3a5f; border: 1.5px solid #2d5080;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.6); transition: all 0.15s;
  }
  .collapse-btn:hover { background: #2d5080; color: #fff; }

  /* Main */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 60px; background: #fff; border-bottom: 1px solid #e8eaed;
    display: flex; align-items: center; padding: 0 28px;
    gap: 12px; flex-shrink: 0;
  }
  .topbar-title { font-size: 15px; font-weight: 600; color: #1a1a2e; }
  .topbar-sub { font-size: 12px; color: #8a94a6; margin-left: 2px; }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%; background: #e6f0fb;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #1a5fa8; cursor: pointer;
  }
  .badge-status {
    font-size: 11px; padding: 3px 10px; border-radius: 20px;
    background: #e6f5ec; color: #1a7a45; font-weight: 500;
  }

  /* Content area */
  .content { flex: 1; overflow-y: auto; padding: 28px 28px 40px; }

  /* Page header */
  .page-header { margin-bottom: 24px; }
  .page-header h1 { font-size: 20px; font-weight: 600; color: #1a1a2e; }
  .page-header p { font-size: 13px; color: #8a94a6; margin-top: 3px; }

  /* Cards grid */
  .cards-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 18px; max-width: 900px;
  }

  .card {
    background: #fff; border: 1px solid #e8eaed; border-radius: 14px;
    padding: 22px 24px; cursor: pointer; transition: all 0.2s;
    display: flex; flex-direction: column; gap: 14px; min-height: 150px;
    position: relative; overflow: hidden;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); border-color: #d0d5dd; }
  .card-header { display: flex; align-items: flex-start; justify-content: space-between; }
  .card-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .card-arrow { color: #c0c7d3; transition: transform 0.2s; }
  .card:hover .card-arrow { transform: translateX(3px); color: #8a94a6; }
  .card-title { font-size: 13px; font-weight: 600; color: #1a1a2e; letter-spacing: 0.1px; }
  .card-value { font-size: 26px; font-weight: 600; line-height: 1.1; }
  .card-meta { font-size: 12px; color: #8a94a6; margin-top: 2px; }
  .card-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 500;
  }
  .chip-green { background: #e6f5ec; color: #1a7a45; }
  .chip-orange { background: #fff3e6; color: #c25c00; }
  .chip-blue { background: #e6f0fb; color: #1a5fa8; }
  .chip-purple { background: #f0ecfc; color: #6233c0; }

  /* Table page */
  .table-container {
    background: #fff; border: 1px solid #e8eaed; border-radius: 14px; overflow: hidden;
  }
  .table-header {
    padding: 18px 24px; border-bottom: 1px solid #e8eaed;
    display: flex; align-items: center; justify-content: space-between;
  }
  .table-header h2 { font-size: 15px; font-weight: 600; color: #1a1a2e; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th {
    padding: 11px 20px; text-align: left; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.8px; color: #8a94a6;
    background: #f8f9fb; border-bottom: 1px solid #e8eaed;
  }
  tbody tr { border-bottom: 1px solid #f0f2f5; transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #fafbfd; }
  tbody td { padding: 13px 20px; color: #3d4355; }
  .td-primary { color: #1a1a2e; font-weight: 500; }
  .status-pill {
    display: inline-block; padding: 2px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500;
  }
  .status-collected { background: #e6f5ec; color: #1a7a45; }
  .status-pending { background: #fff3e6; color: #c25c00; }

  /* City ranking */
  .ranking-list { display: flex; flex-direction: column; gap: 0; }
  .rank-row {
    display: flex; align-items: center; padding: 16px 24px; gap: 16px;
    border-bottom: 1px solid #f0f2f5; transition: background 0.1s;
  }
  .rank-row:last-child { border-bottom: none; }
  .rank-row:hover { background: #fafbfd; }
  .rank-num {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; flex-shrink: 0;
  }
  .rank-1 { background: #fff3e6; color: #c25c00; }
  .rank-2 { background: #f0f2f5; color: #5f5e5a; }
  .rank-3 { background: #faeeda; color: #854f0b; }
  .rank-other { background: #f4f5f7; color: #8a94a6; }
  .rank-city { flex: 1; font-size: 14px; font-weight: 500; color: #1a1a2e; }
  .rank-bar-wrap { flex: 2; height: 6px; background: #f0f2f5; border-radius: 99px; overflow: hidden; }
  .rank-bar { height: 100%; border-radius: 99px; }
  .rank-kg { font-size: 13px; color: #3d4355; min-width: 60px; text-align: right; font-weight: 500; }
  .rank-change { font-size: 11px; min-width: 36px; text-align: right; font-weight: 500; }
  .change-pos { color: #1a7a45; }
  .change-neg { color: #a32d2d; }
  .change-neu { color: #8a94a6; }

  /* Access denied */
  .access-denied {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 400px; gap: 14px; text-align: center;
  }
  .access-denied h2 { font-size: 18px; font-weight: 600; color: #1a1a2e; }
  .access-denied p { font-size: 13px; color: #8a94a6; max-width: 300px; line-height: 1.6; }

  /* Simple pages */
  .simple-page {
    background: #fff; border: 1px solid #e8eaed; border-radius: 14px;
    padding: 40px; max-width: 600px;
  }
  .simple-page h2 { font-size: 17px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
  .simple-page p { font-size: 13px; color: #5f5e5a; line-height: 1.7; }

  /* Loading */
  .skeleton {
    background: linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }

  /* Scrollbar */
  .content::-webkit-scrollbar { width: 5px; }
  .content::-webkit-scrollbar-track { background: transparent; }
  .content::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 99px; }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Sidebar({ currentPage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  const mainItems = [
    { id: "account",   label: "My Account",       icon: <IconUser /> },
    { id: "dashboard", label: "Dashboard",         icon: <IconDashboard /> },
    { id: "admin",     label: "Admin Dashboard",   icon: <IconAdmin /> },
  ];
  const bottomItems = [
    { id: "help",    label: "Help",       icon: <IconHelp /> },
    { id: "about",   label: "About Us",   icon: <IconAbout /> },
    { id: "contact", label: "Contact Us", icon: <IconContact /> },
  ];

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div
        className="collapse-btn"
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          {collapsed
            ? <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M7 2L3 5l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </div>

      <div className="sidebar-logo">
        <div className="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 4h10l2 6H5L7 4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="9" cy="18" r="2" stroke="#fff" strokeWidth="1.8"/>
            <circle cx="15" cy="18" r="2" stroke="#fff" strokeWidth="1.8"/>
          </svg>
        </div>
        {!collapsed && <div className="logo-text">Safai<span>Mitra</span></div>}
      </div>

      <div className="sidebar-section">
        {!collapsed && <div className="sidebar-label">Main</div>}
        {mainItems.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && item.label}
          </div>
        ))}
      </div>

      <div className="sidebar-spacer" />

      <div className="sidebar-bottom">
        {!collapsed && <div className="sidebar-label" style={{ paddingBottom: 8 }}>Support</div>}
        {bottomItems.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}

function Topbar({ page }) {
  const titles = {
    dashboard: { title: "Dashboard", sub: "Overview" },
    history:   { title: "Disposal History", sub: "All records" },
    "city-ranking": { title: "City Ranking", sub: "Analytics" },
    admin:     { title: "Admin Dashboard", sub: "Restricted" },
    account:   { title: "My Account", sub: "Profile" },
    help:      { title: "Help", sub: "Support" },
    about:     { title: "About Us", sub: "Info" },
    contact:   { title: "Contact Us", sub: "Get in touch" },
  };
  const t = titles[page] || titles.dashboard;

  return (
    <div className="topbar">
      <div>
        <span className="topbar-title">{t.title}</span>
        <span className="topbar-sub"> / {t.sub}</span>
      </div>
      <div className="topbar-right">
        <span className="badge-status">● Online</span>
        <div className="avatar">JD</div>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function DashboardPage({ wasteData, cityData, loading, onNavigate }) {
  const latest = wasteData[0];
  const totalPoints = wasteData.reduce((a, d) => a + d.points, 0);

  const cards = [
    {
      id: "latest",
      color: colors.green,
      icon: <IconDisposal color={colors.green.icon} />,
      label: "Latest Disposal",
      value: loading ? null : `${latest?.weight ?? "--"} kg`,
      meta: latest?.type ?? "",
      chip: loading ? null : { label: `+${latest?.points} pts`, cls: "chip-green" },
      action: null,
    },
    {
      id: "reward",
      color: colors.orange,
      icon: <IconReward color={colors.orange.icon} />,
      label: "Reward Section",
      value: loading ? null : `${totalPoints}`,
      meta: "Total Points",
      chip: loading ? null : { label: "Redeemable", cls: "chip-orange" },
      action: null,
    },
    {
      id: "history",
      color: colors.blue,
      icon: <IconHistory color={colors.blue.icon} />,
      label: "Disposal History",
      value: loading ? null : `${wasteData.length}`,
      meta: "Total entries",
      chip: loading ? null : { label: "View all", cls: "chip-blue" },
      action: () => onNavigate("history"),
    },
    {
      id: "city-ranking",
      color: colors.purple,
      icon: <IconCity color={colors.purple.icon} />,
      label: "City Ranking",
      value: loading
        ? null
        : cityData.length
          ? `#1 ${cityData[0].city}`
          : "--",
      meta: "Top city this week",
      chip: loading ? null : { label: "See rankings", cls: "chip-purple" },
      action: () => onNavigate("city-ranking"),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Overview</h1>
        <p>Welcome back, John. Here's your waste management summary.</p>
      </div>
      <div className="cards-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className="card"
            onClick={card.action || undefined}
            style={{ cursor: card.action ? "pointer" : "default" }}
          >
            <div className="card-header">
              <div className="card-icon" style={{ background: card.color.bg }}>
                {card.icon}
              </div>
              {card.action && (
                <span className="card-arrow"><IconChevronRight /></span>
              )}
            </div>

            <div>
              <div className="card-title">{card.label}</div>
              {loading ? (
                <>
                  <div className="skeleton" style={{ height: 28, width: 80, margin: "8px 0 6px" }} />
                  <div className="skeleton" style={{ height: 12, width: 110 }} />
                </>
              ) : (
                <>
                  <div className="card-value" style={{ color: card.color.text }}>{card.value}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span className="card-meta">{card.meta}</span>
                    {card.chip && (
                      <span className={`card-chip ${card.chip.cls}`}>{card.chip.label}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPage({ wasteData, loading }) {
  return (
    <div>
      <div className="page-header">
        <h1>Disposal History</h1>
        <p>Complete record of all waste disposal events.</p>
      </div>
      <div className="table-container">
        <div className="table-header">
          <h2>All Records</h2>
          <span className="card-chip chip-blue">{wasteData.length} entries</span>
        </div>
        {loading ? (
          <div style={{ padding: 32 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: 40, marginBottom: 10, borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Weight</th>
                <th>Points</th>
                <th>City</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wasteData.map((row, i) => (
                <tr key={row.id}>
                  <td style={{ color: "#8a94a6" }}>{i + 1}</td>
                  <td className="td-primary">{row.type}</td>
                  <td>{row.weight} kg</td>
                  <td style={{ color: colors.orange.icon, fontWeight: 500 }}>+{row.points}</td>
                  <td>{row.city}</td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`status-pill status-${(row.status || "pending").toLowerCase()}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CityRankingPage({ cityData, loading }) {
  const max = cityData[0]?.totalKg || 1;
  const barColors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"];

  return (
    <div>
      <div className="page-header">
        <h1>City Ranking</h1>
        <p>Top cities by total waste collected this week.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20, maxWidth: 600 }}>
        {[
          { label: "Cities tracked", value: cityData.length, color: colors.blue },
          { label: "Total kg collected", value: cityData.reduce((a, c) => a + Number(c.totalKg || 0), 0).toFixed(1), color: colors.green },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.color.bg, borderRadius: 12, padding: "16px 20px",
            border: `1px solid ${stat.color.border}`
          }}>
            <div style={{ fontSize: 12, color: stat.color.text, fontWeight: 500, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: stat.color.text }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header"><h2>Rankings</h2></div>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <div className="ranking-list">
            {cityData.map((c, i) => (
              <div className="rank-row" key={c.city}>
                <div className={`rank-num rank-${i < 3 ? i+1 : "other"}`}>{c.rank}</div>
                <div className="rank-city">{c.city}</div>
                <div className="rank-bar-wrap">
                  <div className="rank-bar" style={{ width: `${(c.totalKg / max) * 100}%`, background: barColors[i % barColors.length] }} />
                </div>
                <div className="rank-kg">{c.totalKg} kg</div>
                <div className={`rank-change ${c.change > 0 ? "change-pos" : c.change < 0 ? "change-neg" : "change-neu"}`}>
                  {c.change > 0 ? `▲ ${c.change}` : c.change < 0 ? `▼ ${Math.abs(c.change)}` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="access-denied">
      <div style={{ background: "#fcebeb", borderRadius: "50%", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IconLock />
      </div>
      <h2>Access Restricted</h2>
      <p>You do not have permission to view the Admin Dashboard. Please contact your administrator for access.</p>
      <span className="status-pill" style={{ background: "#fcebeb", color: "#a32d2d", fontSize: 12, padding: "4px 14px" }}>
        Role: Standard User
      </span>
    </div>
  );
}

function AccountPage() {
  return (
    <div>
      <div className="page-header"><h1>My Account</h1><p>Your profile and preferences.</p></div>
      <div className="simple-page">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#e6f0fb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 600, color: "#1a5fa8"
          }}>JD</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>John Doe</div>
            <div style={{ color: "#8a94a6", fontSize: 13 }}>john.doe@safaimitra.app</div>
          </div>
          <span className="badge-status" style={{ marginLeft: "auto" }}>Standard User</span>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { label: "Member since", value: "January 2025" },
            { label: "Total disposals", value: "7 events" },
            { label: "Points earned", value: "74 pts" },
            { label: "City", value: "Mumbai" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "11px 0", borderBottom: "1px solid #f0f2f5", fontSize: 13
            }}>
              <span style={{ color: "#8a94a6" }}>{item.label}</span>
              <span style={{ fontWeight: 500, color: "#1a1a2e" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SimplePage({ title, children }) {
  return (
    <div>
      <div className="page-header"><h1>{title}</h1></div>
      <div className="simple-page">{children}</div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [wasteData, setWasteData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);

      const [waste, city] = await Promise.all([
        fetchWasteData(),
        fetchCityData(),
      ]);

      setWasteData(waste);
      setCityData(city);
    } catch (err) {
      console.error("Frontend data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <DashboardPage wasteData={wasteData} cityData={cityData} loading={loading} onNavigate={setPage} />;
      case "history":      return <HistoryPage wasteData={wasteData} loading={loading} />;
      case "city-ranking": return <CityRankingPage cityData={cityData} loading={loading} />;
      case "admin":        return <AdminPage />;
      case "account":      return <AccountPage />;
      case "help":         return (
        <SimplePage title="Help">
          <h2>How can we help?</h2>
          <p>For questions about using SafaiMitra, recording waste disposals, or managing your rewards, visit our documentation or reach out to support.</p>
          <p style={{ marginTop: 12 }}>Support email: <span style={{ color: "#1a5fa8" }}>support@safaimitra.app</span></p>
        </SimplePage>
      );
      case "about":        return (
        <SimplePage title="About Us">
          <h2>SafaiMitra</h2>
          <p>SafaiMitra is a waste management tracking platform designed to encourage sustainable disposal habits through a city-wide rewards system. We partner with municipalities to measure, reward, and improve recycling outcomes.</p>
        </SimplePage>
      );
      case "contact":      return (
        <SimplePage title="Contact Us">
          <h2>Get in touch</h2>
          <p>Reach our team at <span style={{ color: "#1a5fa8" }}>hello@safaimitra.app</span> or call <span style={{ fontWeight: 500 }}>+91 98765 43210</span>.</p>
          <p style={{ marginTop: 12 }}>Office hours: Mon–Fri, 9 AM – 6 PM IST</p>
        </SimplePage>
      );
      default:
        return (
          <DashboardPage
            wasteData={wasteData}
            cityData={cityData}
            loading={loading}
            onNavigate={setPage}
          />
        );
    }
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div className="app">
        <Sidebar currentPage={page} onNavigate={setPage} />
        <div className="main">
          <Topbar page={page} />
          <div className="content">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
