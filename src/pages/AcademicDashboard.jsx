import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Grid2X2, List, LogOut, Plus } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { useCollectionStore } from "../hooks/useCollectionStore";
import {
  UNIVERSITY_PROGRAMS_KEY,
  mockUniversityProgramsSeed,
} from "../data/mockUniversityPrograms";
import { SCHOLARSHIPS_KEY, mockScholarshipsSeed } from "../data/mockScholarships";
import "./StudentBuddyDashboard.css";
import "./AcademicDashboard.css";
import schotersLogo from "../assets/schoters-logo.png";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function AcademicDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);

  const universityStore = useCollectionStore(UNIVERSITY_PROGRAMS_KEY, mockUniversityProgramsSeed);
  const scholarshipStore = useCollectionStore(SCHOLARSHIPS_KEY, mockScholarshipsSeed);

  const totalUniversity = useCountUp(universityStore.items.length);
  const totalScholarship = useCountUp(scholarshipStore.items.length);

  const recentUniversity = universityStore.items.slice(0, 3);
  const recentScholarship = scholarshipStore.items.slice(0, 3);

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/academic/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/academic/master-data" className={navLinkClass}>
            <BookOpen size={22} />
            <span>Master Data</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Academic Team"}</strong>
            <small>Academic</small>
          </span>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Academic</strong>
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
          </div>

          <section className="academic-stat-grid fade-in-up" style={{ "--delay": "80ms" }}>
            <article className="academic-stat-card">
              <h2>Universitas &amp; Program</h2>
              <strong>{totalUniversity}</strong>
              <p>Total data program yang tersedia untuk direkomendasikan SSO.</p>
              <button
                type="button"
                className="outline-button"
                onClick={() => navigate("/academic/master-data?tab=university&add=1")}
              >
                <Plus size={18} />
                Tambah Program
              </button>
            </article>

            <article className="academic-stat-card">
              <h2>Beasiswa</h2>
              <strong>{totalScholarship}</strong>
              <p>Total data beasiswa yang tersedia untuk direkomendasikan SSO.</p>
              <button
                type="button"
                className="outline-button"
                onClick={() => navigate("/academic/master-data?tab=scholarship&add=1")}
              >
                <Plus size={18} />
                Tambah Beasiswa
              </button>
            </article>
          </section>

          <section className="academic-recent-section fade-in-up" style={{ "--delay": "160ms" }}>
            <div className="academic-recent-card">
              <header className="academic-recent-header">
                <h2>Baru Ditambahkan</h2>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => navigate("/academic/master-data")}
                >
                  Lihat semua
                  <ChevronRight size={16} />
                </button>
              </header>

              <div className="academic-recent-columns">
                <div>
                  <span className="academic-recent-label">Universitas & Program</span>
                  <ul className="academic-recent-list">
                    {recentUniversity.map((item) => (
                      <li key={item.id}>
                        <strong>{item.university}</strong>
                        <span>{item.program} • {item.country}</span>
                      </li>
                    ))}
                    {recentUniversity.length === 0 && (
                      <li className="academic-recent-empty">Belum ada data.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <span className="academic-recent-label">Beasiswa</span>
                  <ul className="academic-recent-list">
                    {recentScholarship.map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>
                        <span>{item.provider} • {item.coverage}</span>
                      </li>
                    ))}
                    {recentScholarship.length === 0 && (
                      <li className="academic-recent-empty">Belum ada data.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function getDisplayName(name) {
  if (!name) return "Academic Team";
  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
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