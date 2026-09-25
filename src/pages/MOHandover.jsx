import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  Grid2X2,
  ClipboardCheck,
  LogOut,
  Search,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockMoHandoverForms } from "../data/mockMoHandoverForms";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function MOHandover({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);

  const counts = useMemo(
    () => ({
      all: mockMoHandoverForms.length,
    }),
    []
  );

  const filteredForms = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return mockMoHandoverForms.filter((form) => {
      const matchesSearch =
        !keyword ||
        form.studentName.toLowerCase().includes(keyword) ||
        form.studentId.toLowerCase().includes(keyword) ||
        form.id.toLowerCase().includes(keyword) ||
        form.packageName.toLowerCase().includes(keyword);
      return matchesSearch;
    });
  }, [searchKeyword]);

  return (
    <main className="dashboard-page mo-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/mo/handover" end className={navLinkClass}>
            <FileText size={22} />
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
              <p className="mo-eyebrow">STUDENT INTAKE</p>
              <h1>Form handover student</h1>
              <p>
                Lihat informasi awal student dari proses pembelian produk
                Schoters sebelum sesi onboarding dimulai.
              </p>
            </div>
            <div className="mo-read-only-note">
              <FileText size={16} /> View only
            </div>
          </div>

          <section className="mo-summary-grid mo-summary-single" aria-label="Ringkasan form handover">
            <SummaryCard label="Total form handover" value={counts.all} icon={Users} tone="blue" />
          </section>

          <section className="mo-handover-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="mo-card-header">
              <div>
                <h2>Daftar form handover</h2>
                <p>Semua data intake yang diteruskan ke MO sudah melewati kelengkapan form handover.</p>
              </div>
              <span>{filteredForms.length} form</span>
            </header>

            <div className="mo-toolbar">
              <label className="mo-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Cari nama student, ID, atau paket..."
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
              </label>
            </div>

            <div className="mo-table-wrapper">
              <table className="mo-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Produk</th>
                    <th>Payment date</th>
                    <th>Form status</th>
                    <th>Diteruskan oleh</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map((form) => (
                    <tr key={form.id}>
                      <td><strong>{form.studentName}</strong><span>{form.studentId} · {form.id}</span></td>
                      <td><strong>{form.packageName}</strong><span>{form.program}</span></td>
                      <td className="mo-date-cell">{form.paymentDate}</td>
                      <td><HandoverStatus status={form.handoverStatus} /></td>
                      <td className="mo-muted-cell">{form.submittedBy}</td>
                      <td><button type="button" className="mo-detail-button" onClick={() => setSelectedForm(form)}>Lihat form</button></td>
                    </tr>
                  ))}
                  {filteredForms.length === 0 && (
                    <tr className="mo-empty-row"><td colSpan={6}>Tidak ada form handover yang sesuai.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedForm && <HandoverDetail form={selectedForm} onClose={() => setSelectedForm(null)} />}
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return <article className={`mo-summary-card tone-${tone}`}><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function HandoverStatus({ status }) {
  const complete = status === "complete";
  return <span className={`mo-status ${complete ? "complete" : "incomplete"}`}><span />{complete ? "Lengkap" : "Perlu dilengkapi"}</span>;
}

function HandoverDetail({ form, onClose }) {
  return (
    <div className="mo-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="mo-drawer" role="dialog" aria-modal="true" aria-labelledby="mo-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="mo-drawer-header">
          <div><span className="mo-drawer-eyebrow">FORM HANDOVER · {form.id}</span><h2 id="mo-detail-title">{form.studentName}</h2><p>{form.studentId} · Diteruskan {form.submittedAt}</p></div>
          <button type="button" className="mo-close-button" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="mo-drawer-status-row"><HandoverStatus status={form.handoverStatus} /><span>{form.submittedBy}</span></div>

        <DetailSection title="Informasi kontak">
          <DetailItem label="Email" value={form.email} />
          <DetailItem label="No. HP" value={form.phone} />
          <DetailItem label="Pendidikan saat ini" value={form.currentEducation} />
        </DetailSection>
        <DetailSection title="Informasi pembelian">
          <DetailItem label="Produk" value={form.packageName} />
          <DetailItem label="Program" value={form.program} />
          <DetailItem label="Payment date" value={form.paymentDate} />
        </DetailSection>
        <DetailSection title="Rencana studi">
          <DetailItem label="Jenjang tujuan" value={form.targetDegree} />
          <DetailItem label="Target intake" value={form.targetIntake} />
          <DetailItem label="Jurusan tujuan" value={form.intendedMajor} />
          <DetailItem label="Negara tujuan" value={form.targetCountries} />
          <DetailItem label="Universitas tujuan" value={form.targetUniversities} />
          <DetailItem label="Range budget" value={form.budgetRange} />
          <DetailItem label="English level" value={form.englishLevel} />
        </DetailSection>
        <DetailSection title="Catatan handover">
          <div className="mo-note-block"><span>Tujuan student</span><p>{form.studentGoals}</p></div>
          <div className="mo-note-block"><span>Catatan tambahan</span><p>{form.additionalNotes}</p></div>
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
