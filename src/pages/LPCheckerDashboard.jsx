import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  LogOut,
  Search,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { LP_STATUS, mockLpCreations } from "../data/mockLpCreations";
import "../pages/StudentBuddyDashboard.css";
import "./LPCheckerDashboard.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function LPCheckerDashboard({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLp, setSelectedLp] = useState(null);

  const counts = useMemo(
    () => ({
      all: mockLpCreations.length,
      review: mockLpCreations.filter((lp) => lp.status === "review").length,
      checked: mockLpCreations.filter((lp) => lp.status === "checked").length,
      released: mockLpCreations.filter((lp) => lp.status === "released").length,
    }),
    []
  );

  const filteredLps = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return mockLpCreations.filter((lp) => {
      const matchesSearch =
        !keyword ||
        [lp.studentName, lp.studentId, lp.id, lp.targetMajor, lp.program, lp.createdBy]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesStatus = statusFilter === "all" || lp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchKeyword, statusFilter]);

  return (
    <main className="dashboard-page lp-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/lp-checker/learning-plans" end className={navLinkClass}>
            <BookOpen size={22} />
            <span>LP Creation</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "LP Checker"}</strong>
            <small>LP Checker</small>
          </span>
          <button type="button" className="sidebar-logout-button" aria-label="Keluar" title="Keluar" onClick={onLogout}>
            <LogOut size={17} />
          </button>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <strong>LP Checker</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="lp-content">
          <div className="lp-page-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="lp-eyebrow">LEARNING PLAN</p>
              <h1>LP creation student</h1>
              <p>Melihat learning plan yang dibuat setelah sesi onboarding dan diagnostic checking student.</p>
            </div>
            <div className="lp-read-only-note"><FileText size={16} /> View only</div>
          </div>

          <section className="lp-summary-grid" aria-label="Ringkasan learning plan">
            <SummaryCard label="Total LP" value={counts.all} icon={Users} tone="blue" />
            <SummaryCard label="Menunggu review" value={counts.review} icon={FileText} tone="orange" />
            <SummaryCard label="Sudah dirilis" value={counts.released} icon={CheckCircle2} tone="green" />
          </section>

          <section className="lp-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="lp-card-header">
              <div>
                <h2>Daftar LP creation</h2>
                <p>Learning plan yang digenerate berdasarkan profil dan hasil onboarding student.</p>
              </div>
              <span>{filteredLps.length} LP</span>
            </header>

            <div className="lp-toolbar">
              <label className="lp-search">
                <Search size={18} />
                <input type="search" placeholder="Cari student, ID LP, program, atau jurusan..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} />
              </label>
              <div className="lp-filter-tabs" role="tablist" aria-label="Filter status LP">
                <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="Semua" count={counts.all} />
                <FilterButton active={statusFilter === "review"} onClick={() => setStatusFilter("review")} label="Review" count={counts.review} />
                <FilterButton active={statusFilter === "checked"} onClick={() => setStatusFilter("checked")} label="Sudah dicek" count={counts.checked} />
                <FilterButton active={statusFilter === "released"} onClick={() => setStatusFilter("released")} label="Dirilis" count={counts.released} />
              </div>
            </div>

            <div className="lp-table-wrapper">
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Target studi</th>
                    <th>Dibuat oleh</th>
                    <th>Dibuat pada</th>
                    <th>Status LP</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredLps.map((lp) => (
                    <tr key={lp.id}>
                      <td><strong>{lp.studentName}</strong><span>{lp.studentId} · {lp.id}</span></td>
                      <td><strong>{lp.targetDegree} · {lp.targetMajor}</strong><span>{lp.targetCountries} · {lp.targetIntake}</span></td>
                      <td><strong>{lp.createdBy.split(" · ")[0]}</strong><span>{lp.createdBy.split(" · ")[1]}</span></td>
                      <td className="lp-muted-cell">{lp.createdAt}</td>
                      <td><LpStatus status={lp.status} /></td>
                      <td><button type="button" className="lp-detail-button" onClick={() => setSelectedLp(lp)}>Lihat LP</button></td>
                    </tr>
                  ))}
                  {filteredLps.length === 0 && <tr className="lp-empty-row"><td colSpan={6}>Tidak ada LP yang sesuai.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedLp && <LpDetailDrawer lp={selectedLp} onClose={() => setSelectedLp(null)} />}
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return <article className={`lp-summary-card tone-${tone}`}><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function FilterButton({ active, onClick, label, count }) {
  return <button type="button" className={active ? "active" : ""} role="tab" aria-selected={active} onClick={onClick}>{label}<span>{count}</span></button>;
}

function LpStatus({ status }) {
  const config = LP_STATUS[status];
  return <span className={`lp-status ${config.tone}`}><span />{config.label}</span>;
}

function LpDetailDrawer({ lp, onClose }) {
  return (
    <div className="lp-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="lp-drawer" role="dialog" aria-modal="true" aria-labelledby="lp-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="lp-drawer-header">
          <div><span className="lp-drawer-eyebrow">LEARNING PLAN · {lp.id}</span><h2 id="lp-detail-title">{lp.studentName}</h2><p>{lp.studentId} · Dibuat {lp.createdAt}</p></div>
          <button type="button" className="lp-close-button" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="lp-drawer-status"><LpStatus status={lp.status} /><span>View only</span></div>

        <DetailSection title="Informasi student">
          <DetailItem label="Email" value={lp.email} />
          <DetailItem label="No. HP" value={lp.phone} />
          <DetailItem label="Program" value={lp.program} />
          <DetailItem label="Dibuat oleh" value={lp.createdBy} />
          <DetailItem label="Update terakhir" value={lp.updatedAt} />
        </DetailSection>
        <DetailSection title="Target studi">
          <DetailItem label="Jenjang" value={lp.targetDegree} />
          <DetailItem label="Jurusan" value={lp.targetMajor} />
          <DetailItem label="Negara tujuan" value={lp.targetCountries} />
          <DetailItem label="Target intake" value={lp.targetIntake} />
        </DetailSection>
        <DetailSection title="Isi learning plan">
          <div className="lp-note-block"><span>Tujuan utama</span><p>{lp.objective}</p></div>
          <div className="lp-note-block"><span>Focus area</span><ul>{lp.focusAreas.map((area) => <li key={area}>{area}</li>)}</ul></div>
          <div className="lp-note-block"><span>Milestone awal</span><ul>{lp.milestones.map((milestone) => <li key={milestone}>{milestone}</li>)}</ul></div>
          <div className="lp-note-block"><span>Catatan onboarding</span><p>{lp.notes}</p></div>
        </DetailSection>
      </aside>
    </div>
  );
}

function DetailSection({ title, children }) {
  return <section className="lp-detail-section"><h3>{title}</h3><div className="lp-detail-grid">{children}</div></section>;
}

function DetailItem({ label, value }) {
  return <div className="lp-detail-item"><span>{label}</span><strong>{value}</strong></div>;
}

function getInitials(name) {
  if (!name) return "LP";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
