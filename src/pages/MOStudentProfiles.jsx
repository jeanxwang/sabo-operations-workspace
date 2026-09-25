import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  ClipboardCheck,
  FileText,
  Grid2X2,
  LogOut,
  Search,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockMoStudentProfiles } from "../data/mockMoStudentProfiles";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";
import "./MOStudentProfiles.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function MOStudentProfiles({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filteredProfiles = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return mockMoStudentProfiles;

    return mockMoStudentProfiles.filter((profile) =>
      [profile.name, profile.id, profile.email, profile.intendedMajor]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [searchKeyword]);

  return (
    <main className="dashboard-page mo-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/mo/handover" className={navLinkClass}>
            <ClipboardList size={22} />
            <span>Form Handover</span>
          </NavLink>
          <NavLink to="/mo/student-profiles" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Profil SLMS</span>
          </NavLink>
          <NavLink to="/mo/onboarding-checklist" className={navLinkClass}>
            <ClipboardCheck size={22} />
            <span>Onboarding Checklist</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "MO Team"}</strong>
            <small>Mentor Onboarding</small>
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

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Mentor Onboarding</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="mo-content">
          <div className="mo-page-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="mo-eyebrow">STUDENT PROFILE</p>
              <h1>Profil student di SLMS</h1>
              <p>
                Lihat profil awal student yang tersinkron dari Learning Management
                System Schoters sebelum sesi onboarding dimulai.
              </p>
            </div>
            <div className="mo-read-only-note">
              <FileText size={16} /> View only
            </div>
          </div>

          <section className="mo-summary-grid mo-summary-single" aria-label="Ringkasan profil SLMS">
            <SummaryCard
              label="Total profil student"
              value={mockMoStudentProfiles.length}
              icon={Users}
              tone="blue"
            />
          </section>

          <section className="mo-handover-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="mo-card-header">
              <div>
                <h2>Daftar profil SLMS</h2>
                <p>Data hanya dapat dilihat di SABO dan mengikuti data terbaru dari SLMS.</p>
              </div>
              <span>{filteredProfiles.length} student</span>
            </header>

            <div className="mo-toolbar">
              <label className="mo-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Cari nama, ID, email, atau jurusan..."
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
              </label>
              <span className="mo-source-note">
                <span className="mo-source-dot" /> Sinkron dari SLMS
              </span>
            </div>

            <div className="mo-table-wrapper">
              <table className="mo-table mo-profile-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Pendidikan saat ini</th>
                    <th>Target studi</th>
                    <th>Kontak</th>
                    <th>Profil</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>
                        <strong>{profile.name}</strong>
                        <span>{profile.id}</span>
                      </td>
                      <td>
                        <strong>{profile.currentEducation}</strong>
                        <span>{profile.city}</span>
                      </td>
                      <td>
                        <strong>{profile.targetDegree} · {profile.intendedMajor}</strong>
                        <span>{profile.targetIntake}</span>
                      </td>
                      <td>
                        <strong>{profile.email}</strong>
                        <span>{profile.phone}</span>
                      </td>
                      <td><ProfileStatus /></td>
                      <td>
                        <button
                          type="button"
                          className="mo-detail-button"
                          onClick={() => setSelectedProfile(profile)}
                        >
                          Lihat profil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <tr className="mo-empty-row">
                      <td colSpan={6}>Tidak ada profil student yang sesuai.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedProfile && (
        <ProfileDetail profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return (
    <article className={`mo-summary-card tone-${tone}`}>
      <span><Icon size={18} /></span>
      <small>{label}</small>
      <strong>{value}</strong>
    </article>
  );
}

function ProfileStatus() {
  return (
    <span className="mo-status complete">
      <span />Lengkap
    </span>
  );
}

function ProfileDetail({ profile, onClose }) {
  return (
    <div className="mo-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="mo-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mo-profile-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="mo-drawer-header">
          <div>
            <span className="mo-drawer-eyebrow">PROFIL SLMS · {profile.id}</span>
            <h2 id="mo-profile-title">{profile.name}</h2>
            <p>Terakhir disinkronkan {profile.lastSyncedAt}</p>
          </div>
          <button type="button" className="mo-close-button" aria-label="Tutup detail" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="mo-drawer-status-row">
          <ProfileStatus />
          <span className="mo-source-label">Sumber: SLMS</span>
        </div>

        <DetailSection title="Informasi dasar">
          <DetailItem label="Email" value={profile.email} />
          <DetailItem label="No. HP" value={profile.phone} />
          <DetailItem label="Tanggal lahir" value={profile.dateOfBirth} />
          <DetailItem label="Kota domisili" value={profile.city} />
          <DetailItem label="Orang tua" value={profile.parentContact} />
        </DetailSection>
        <DetailSection title="Pendidikan dan target studi">
          <DetailItem label="Pendidikan saat ini" value={profile.currentEducation} />
          <DetailItem label="Jenjang tujuan" value={profile.targetDegree} />
          <DetailItem label="Target intake" value={profile.targetIntake} />
          <DetailItem label="Jurusan tujuan" value={profile.intendedMajor} />
          <DetailItem label="Negara tujuan" value={profile.targetCountries} />
          <DetailItem label="English level" value={profile.englishLevel} />
        </DetailSection>
        <DetailSection title="Profil student">
          <div className="mo-note-block">
            <span>Minat</span>
            <p>{profile.interests}</p>
          </div>
          <div className="mo-note-block">
            <span>Tujuan student</span>
            <p>{profile.studentGoals}</p>
          </div>
        </DetailSection>
      </aside>
    </div>
  );
}

function DetailSection({ title, children }) {
  return <section className="mo-detail-section"><h3>{title}</h3><div className="mo-detail-grid">{children}</div></section>;
}

function DetailItem({ label, value }) {
  return <div className="mo-detail-item"><span>{label}</span><strong>{value}</strong></div>;
}

function getInitials(name) {
  if (!name) return "MO";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
