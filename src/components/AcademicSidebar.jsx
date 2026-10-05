import { NavLink } from "react-router-dom";
import { Award, BookOpen, Grid2X2, LogOut } from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import "../pages/StudentBuddyDashboard.css";
import "./AcademicSidebar.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function AcademicSidebar({ user, onLogout, mode = "academic" }) {
  const isLpChecker = mode === "lp-checker" || user?.role === "lp-checker";
  const basePath = isLpChecker ? "/lp-checker/master-data" : "/academic";
  const primaryPath = isLpChecker ? "/lp-checker/learning-plans" : "/academic/dashboard";
  const roleLabel = isLpChecker ? "LP Checker" : "Academic";

  return (
    <aside className="sidebar">
      <header className="sidebar-brand">
        <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
        <span>SABO</span>
      </header>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink to={primaryPath} end={!isLpChecker} className={navLinkClass}>
          {isLpChecker ? <BookOpen size={22} /> : <Grid2X2 size={22} />}
          <span>{isLpChecker ? "LP Creation" : "Dashboard"}</span>
        </NavLink>

        <div className="academic-sidebar-group">
          <span className="academic-sidebar-group-label">Master Data</span>
          <div className="academic-sidebar-divider" aria-hidden="true" />

          <div className="academic-sidebar-subnav">
            <NavLink to={`${basePath}/universities`} className={navLinkClass}>
              <BookOpen size={20} />
              <span>University &amp; Program</span>
            </NavLink>

            <NavLink to={`${basePath}/scholarships`} className={navLinkClass}>
              <Award size={20} />
              <span>Scholarship</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <footer className="sidebar-profile">
        <span className="profile-avatar">{getInitials(user?.name)}</span>
        <span>
          <strong>{user?.name || "Academic Team"}</strong>
            <small>{roleLabel}</small>
        </span>
        <button
          type="button"
          className="sidebar-logout-button"
          aria-label="Keluar"
          title="Keluar"
          onClick={onLogout}
        >
          <LogOut size={17} />
        </button>
      </footer>
    </aside>
  );
}

function getInitials(name) {
  if (!name) return "AC";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
