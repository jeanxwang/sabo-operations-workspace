import { NavLink, useNavigate } from "react-router-dom";
import { CheckCircle2, Grid2X2, List, LogOut, Ticket, Users } from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { mockHandoverSeed } from "../data/mockHandover";
import { useHandoverStore } from "../hooks/useHandoverStore";
import "./StudentBuddyDashboard.css";
import "./StudentBuddyHandover.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function StudentBuddyHandover({ user, onLogout }) {
  const { items, updateStatus } = useHandoverStore(mockHandoverSeed);
  const pendingCount = items.filter((item) => item.status === "belum").length;

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/student-buddy/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/student-buddy/students" className={navLinkClass}>
            <Users size={22} />
            <span>Students</span>
          </NavLink>
          <NavLink to="/student-buddy/tickets" className={navLinkClass}>
            <Ticket size={22} />
            <span>Tickets</span>
          </NavLink>
          <NavLink to="/student-buddy/handover" className={navLinkClass}>
            <CheckCircle2 size={22} />
            <span>Handover</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Eom Sean"}</strong>
            <small>CX - Student Buddy</small>
          </span>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>Student Buddy</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Handover</strong>
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

        <section className="handover-content fade-in-up" style={{ "--delay": "0ms" }}>
          <div className="handover-header-row">
            <h1>Handover dari SSO ({pendingCount} belum selesai)</h1>
          </div>

          <div className="handover-list">
            {items.map((item) => (
              <article key={item.id} className="handover-card" data-status={item.status}>
                <div className="handover-card-top">
                  <div>
                    <strong>{item.studentName}</strong>
                    <span className="handover-student-id">{item.studentId}</span>
                  </div>
                  <span className={`handover-status-badge status-${item.status}`}>
                    {item.status === "done" ? "Done" : "Belum"}
                  </span>
                </div>

                <p className="handover-message">{item.message}</p>

                <div className="handover-card-footer">
                  <span className="handover-meta">
                    Dari: {item.fromSso} • {item.createdAt}
                  </span>

                  {item.status === "belum" ? (
                    <button
                      type="button"
                      className="outline-button handover-done-button"
                      onClick={() => updateStatus(item.id, "done")}
                    >
                      <CheckCircle2 size={16} />
                      Tandai Selesai
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => updateStatus(item.id, "belum")}
                    >
                      Batalkan status selesai
                    </button>
                  )}
                </div>
              </article>
            ))}

            {items.length === 0 && (
              <p className="handover-empty-text">Belum ada handover dari SSO.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function getInitials(name) {
  if (!name) return "ES";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}