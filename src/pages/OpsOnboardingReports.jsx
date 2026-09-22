import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Grid2X2,
  LogOut,
  Search,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockOpsOnboardingReports } from "../data/mockOpsOnboardingReports";
import "../pages/StudentBuddyDashboard.css";
import "./OpsOnboardingReports.css";

const REPORT_FILTERS = [
  { id: "all", label: "Semua report" },
  { id: "scheduled", label: "Terjadwal" },
  { id: "in-progress", label: "Sedang berjalan" },
  { id: "completed", label: "Selesai" },
];

const STATUS_LABELS = {
  scheduled: "Terjadwal",
  "in-progress": "Sedang berjalan",
  completed: "Selesai",
  rescheduled: "Dijadwalkan ulang",
  waiting: "Menunggu jadwal",
};

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsOnboardingReports({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const reportCounts = useMemo(
    () => ({
      all: mockOpsOnboardingReports.length,
      scheduled: mockOpsOnboardingReports.filter((report) => report.status === "scheduled").length,
      "in-progress": mockOpsOnboardingReports.filter((report) => report.status === "in-progress").length,
      completed: mockOpsOnboardingReports.filter((report) => report.status === "completed").length,
    }),
    []
  );

  const filteredReports = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return mockOpsOnboardingReports.filter((report) => {
      const matchesFilter = activeFilter === "all" || report.status === activeFilter;
      const matchesSearch =
        !keyword ||
        report.studentName.toLowerCase().includes(keyword) ||
        report.studentId.toLowerCase().includes(keyword) ||
        report.id.toLowerCase().includes(keyword) ||
        report.mo.toLowerCase().includes(keyword);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchKeyword]);

  const completedCount = reportCounts.completed;
  const activeCount = reportCounts["in-progress"];
  const scheduledCount = reportCounts.scheduled;

  return (
    <main className="dashboard-page ops-dashboard-page ops-reports-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/ops/dashboard" end className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/ops/onboarding-reports" className={navLinkClass}>
            <FileText size={22} />
            <span>Onboarding Session</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Ops Team"}</strong>
            <small>Operations</small>
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
            <span>Ops</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Onboarding Session</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="ops-reports-content">
          <div className="ops-reports-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="ops-eyebrow">ONBOARDING REPORT</p>
              <h1>Monitor onboarding session</h1>
              <p>
                Pantau jadwal, kehadiran, dan status onboarding session student
                yang sudah siap diproses.
              </p>
            </div>
            <span className="ops-report-source"><span /> Data dari laporan onboarding</span>
          </div>

          <section className="ops-report-stat-grid" aria-label="Ringkasan onboarding session">
            <ReportStat label="Total report" value={reportCounts.all} icon={FileText} />
            <ReportStat label="Terjadwal" value={scheduledCount} icon={CalendarDays} />
            <ReportStat label="Sedang berjalan" value={activeCount} icon={Clock3} />
            <ReportStat label="Selesai" value={completedCount} icon={CheckCircle2} />
          </section>

          <section className="ops-report-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-report-card-header">
              <div>
                <h2>Daftar report onboarding</h2>
                <p>Gunakan detail report untuk melihat konteks sesi dan catatan terakhir.</p>
              </div>
              <span className="ops-report-total"><Users size={15} /> {filteredReports.length} report</span>
            </header>

            <div className="ops-report-toolbar">
              <label className="ops-report-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Cari student, ID, report, atau MO..."
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
              </label>
              <div className="ops-report-filters" role="tablist" aria-label="Filter report onboarding">
                {REPORT_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    className={activeFilter === filter.id ? "active" : ""}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}<span>{reportCounts[filter.id]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ops-report-table-wrapper">
              <table className="ops-report-table">
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Student</th>
                    <th>Jadwal sesi</th>
                    <th>MO</th>
                    <th>Status</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td><strong>{report.id}</strong><span>{report.updatedAt}</span></td>
                      <td><strong>{report.studentName}</strong><span>{report.studentId}</span></td>
                      <td className="ops-report-date">{report.sessionAt}</td>
                      <td>{report.mo}</td>
                      <td><ReportStatus status={report.status} /></td>
                      <td>
                        <button type="button" className="ops-report-detail-button" onClick={() => setSelectedReport(report)}>
                          <Eye size={15} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr className="ops-report-empty"><td colSpan={6}>Tidak ada report yang sesuai dengan filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedReport && (
        <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </main>
  );
}

function ReportStat({ label, value, icon: Icon }) {
  return <article className="ops-report-stat"><span><Icon size={17} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function ReportStatus({ status }) {
  return <span className={`ops-report-status status-${status}`}>{STATUS_LABELS[status]}</span>;
}

function ReportDetail({ report, onClose }) {
  return (
    <div className="ops-report-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="ops-report-drawer" role="dialog" aria-modal="true" aria-labelledby="ops-report-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="ops-report-drawer-header">
          <div><span>ONBOARDING REPORT</span><h2 id="ops-report-detail-title">{report.id}</h2><p>{report.studentName} · {report.studentId}</p></div>
          <button type="button" className="ops-report-close" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button>
        </header>
        <div className="ops-report-drawer-status"><ReportStatus status={report.status} /><span>Terakhir diperbarui {report.updatedAt}</span></div>
        <dl className="ops-report-detail-list">
          <div><dt>Jadwal sesi</dt><dd>{report.sessionAt}</dd></div>
          <div><dt>MO</dt><dd>{report.mo}</dd></div>
          <div><dt>Kehadiran</dt><dd>{report.attendance}</dd></div>
        </dl>
        <section className="ops-report-notes"><h3>Catatan</h3><p>{report.notes}</p></section>
      </aside>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "OP";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
