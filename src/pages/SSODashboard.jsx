import { NavLink, useNavigate } from "react-router-dom";
import {
  Grid2X2,
  Users,
  List,
  LogOut,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import {
  ssoHighlights,
  ssoPriorityStudents,
  ssoCxUpdates,
} from "../data/mockSsoDashboard";
import "./StudentBuddyDashboard.css";
import "./SSODashboard.css";
import schotersLogo from "../assets/schoters-logo.png";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function SSODashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);
  const initials = getInitials(user?.name);
  const totalStudents = useCountUp(350);

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/sso/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/sso/students" className={navLinkClass}>
            <Users size={22} />
            <span>Students</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{initials}</span>
          <span>
            <strong>{user?.name || "Jung Kook"}</strong>
            <small>SSO</small>
          </span>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <strong>SSO</strong>
          </div>

          <div className="topbar-actions">
            <button type="button" aria-label="Menu">
              <List size={22} />
            </button>

            <button type="button" aria-label="Logout" onClick={onLogout}>
              <LogOut size={22} />
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <h1>Welcome back, {displayName}!</h1>

            <button type="button" className="outline-button update-progress-button">
              <RefreshCcw size={18} />
              Update progress student
            </button>
          </div>

          <section
            className="student-summary fade-in-up"
            style={{ "--delay": "80ms" }}
            aria-label="Total student aktif"
          >
            <h2>Total Student Aktif</h2>
            <p>yang sedang dipegang oleh {displayName} sebagai SSO</p>
            <strong className="summary-count">{totalStudents}</strong>

            <button
              type="button"
              className="outline-button view-students-button"
              onClick={() => navigate("/sso/students")}
            >
              <Users size={20} />
              Lihat semua student
            </button>
          </section>

          <section className="sso-highlight-section fade-in-up" style={{ "--delay": "140ms" }}>
            <h2>Sorotan</h2>

            <div className="sso-highlight-grid">
              {ssoHighlights.map((item, index) => (
                <HighlightCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </section>

          <section className="sso-priority-section fade-in-up" style={{ "--delay": "220ms" }}>
            <div className="priority-table-card">
              <header className="priority-table-header">
                <h2>Student perlu diperhatikan</h2>
                <span className="priority-sort-note">urgent first</span>
              </header>

              <table className="priority-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Stage</th>
                    <th>Issue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ssoPriorityStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
                      <td>{student.stage}</td>
                      <td>{student.issue}</td>
                      <td>
                        <span className={`status-badge status-${student.statusLevel}`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sso-updates-section fade-in-up" style={{ "--delay": "280ms" }}>
            <div className="cx-updates-card">
              <h2>Update dari CX/Lainnya</h2>

              <div className="cx-updates-list">
                {ssoCxUpdates.map((update) => (
                  <article key={update.id} className="cx-update-item">
                    <strong>{update.name}</strong>
                    <p>{update.message}</p>
                    <span>{update.time}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function HighlightCard({ item, index }) {
  const count = useCountUp(item.count, 700);

  return (
    <article className="sso-highlight-card" style={{ "--delay": `${180 + index * 60}ms` }}>
      <h3>{item.title}</h3>
      <strong>{count}</strong>

      {item.description && <p>{item.description}</p>}

      {item.actionLabel && (
        <button type="button" className="outline-button highlight-action-button">
          <MessageCircle size={18} />
          {item.actionLabel}
        </button>
      )}
    </article>
  );
}

function getDisplayName(name) {
  if (!name) return "JK";

  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
}

function getInitials(name) {
  if (!name) return "JK";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}