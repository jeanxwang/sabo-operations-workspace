import { NavLink } from "react-router-dom";
import { Award, BookOpen, Grid2X2 } from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import "../pages/StudentBuddyDashboard.css";
import "./AcademicSidebar.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function AcademicSidebar({ user }) {
  return (
    <aside className="sidebar">
      <header className="sidebar-brand">
        <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
        <span>SABO</span>
      </header>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink to="/academic/dashboard" end className={navLinkClass}>
          <Grid2X2 size={22} />
          <span>Dashboard</span>
        </NavLink>

        <div className="academic-sidebar-group">
          <span className="academic-sidebar-group-label">Master Data</span>
          <div className="academic-sidebar-divider" aria-hidden="true" />

          <div className="academic-sidebar-subnav">
            <NavLink to="/academic/universities" className={navLinkClass}>
              <BookOpen size={20} />
              <span>University &amp; Program</span>
            </NavLink>

            <NavLink to="/academic/scholarships" className={navLinkClass}>
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
          <small>Academic</small>
        </span>
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
