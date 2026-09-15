import { useNavigate } from "react-router-dom";
import { ChevronRight, List, LogOut, Plus } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { useUniversityPrograms } from "../hooks/useUniversityPrograms";
import { useScholarships } from "../hooks/useScholarships";
import AcademicSidebar from "../components/AcademicSidebar";
import "./StudentBuddyDashboard.css";
import "./AcademicDashboard.css";

export default function AcademicDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);

  const universityApi = useUniversityPrograms();
  const scholarshipApi = useScholarships();

  const totalUniversity = useCountUp(universityApi.items.length);
  const totalScholarship = useCountUp(scholarshipApi.items.length);

  const recentUniversity = universityApi.items.slice(0, 3);
  const recentScholarship = scholarshipApi.items.slice(0, 3);

  return (
    <main className="dashboard-page">
      <AcademicSidebar user={user} />

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
                onClick={() => navigate("/academic/universities?add=1")}
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
                onClick={() => navigate("/academic/scholarships?add=1")}
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
                <div className="academic-recent-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate("/academic/universities")}
                  >
                    Universitas
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate("/academic/scholarships")}
                  >
                    Beasiswa
                    <ChevronRight size={16} />
                  </button>
                </div>
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
