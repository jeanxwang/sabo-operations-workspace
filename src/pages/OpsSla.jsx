import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ClockAlert,
  FileText,
  Grid2X2,
  LogOut,
  Search,
  Timer,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import {
  getOpsSlaSummary,
  mockOpsStudents,
} from "../data/mockOpsStudents";
import "../pages/StudentBuddyDashboard.css";
import "./OpsSla.css";

const SLA_FILTERS = [
  { id: "all", label: "Semua student" },
  { id: "overdue", label: "Overdue" },
  { id: "on-track", label: "On track" },
  { id: "waiting", label: "Menunggu onboarding" },
  { id: "complete", label: "Selesai" },
];

const STATUS_LABELS = {
  done: "Selesai",
  overdue: "Overdue",
  "on-track": "On track",
  waiting: "Menunggu onboarding",
};

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsSla({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const counts = useMemo(() => {
    const summaries = mockOpsStudents.map((student) => getOpsSlaSummary(student));
    return {
      all: mockOpsStudents.length,
      overdue: summaries.filter((summary) => summary.overdueCount > 0).length,
      overdueMilestones: summaries.reduce((total, summary) => total + summary.overdueCount, 0),
      waiting: summaries.filter((summary) => summary.milestones.every((milestone) => milestone.status === "waiting")).length,
      complete: summaries.filter((summary) => summary.milestones.every((milestone) => milestone.status === "done")).length,
      onTrack: summaries.filter((summary) => summary.milestones.some((milestone) => milestone.status === "on-track")).length,
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return mockOpsStudents.filter((student) => {
      const summary = getOpsSlaSummary(student);
      const matchesSearch =
        !keyword ||
        [student.name, student.id, student.email, student.assignedMo || ""]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesFilter = matchesSlaFilter(summary, activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchKeyword]);

  return (
    <main className="dashboard-page ops-dashboard-page ops-sla-page">
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
          <NavLink to="/ops/sla" className={navLinkClass}>
            <ClockAlert size={22} />
            <span>SLA monitoring</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span><strong>{user?.name || "Ops Team"}</strong><small>Operations</small></span>
          <button type="button" className="sidebar-logout-button" aria-label="Keluar" title="Keluar" onClick={onLogout}><LogOut size={17} /></button>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs"><span>SABO Operations</span><span className="breadcrumb-separator">›</span><strong>Ops · SLA monitoring</strong></div>
          <TopbarActions />
        </header>

        <section className="ops-sla-content">
          <div className="ops-sla-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="ops-eyebrow">SERVICE LEVEL AGREEMENT</p>
              <h1>Monitoring SLA</h1>
              <p>Pastikan setiap milestone setelah onboarding selesai sesuai deadline yang ditetapkan.</p>
            </div>
            <span className="ops-sla-rule-note"><Timer size={15} /> Diagnostic D+1 · LP checked D+2 · LP released D+3</span>
          </div>

          <section className="ops-sla-stat-grid" aria-label="Ringkasan SLA">
            <SlaStat label="Student dipantau" value={counts.all} icon={Users} tone="blue" />
            <SlaStat label="Student overdue" value={counts.overdue} icon={AlertTriangle} tone="red" />
            <SlaStat label="Milestone overdue" value={counts.overdueMilestones} icon={ClockAlert} tone="orange" />
            <SlaStat label="SLA selesai" value={counts.complete} icon={CheckCircle2} tone="green" />
          </section>

          <section className="ops-sla-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-sla-card-header">
              <div><h2>Daftar SLA student</h2><p>Gunakan status overdue untuk menentukan follow-up yang paling mendesak.</p></div>
              <span><Users size={15} /> {filteredStudents.length} student</span>
            </header>
            <div className="ops-sla-toolbar">
              <label className="ops-sla-search"><Search size={18} /><input type="search" placeholder="Cari nama, ID, email, atau MO..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} /></label>
              <div className="ops-sla-filters" role="tablist" aria-label="Filter status SLA">
                {SLA_FILTERS.map((filter) => <button key={filter.id} type="button" role="tab" aria-selected={activeFilter === filter.id} className={activeFilter === filter.id ? "active" : ""} onClick={() => setActiveFilter(filter.id)}>{filter.label}<span>{getFilterCount(filter.id, counts)}</span></button>)}
              </div>
            </div>
            <div className="ops-sla-table-wrapper">
              <table className="ops-sla-table">
                <thead><tr><th>Student</th><th>Onboarding</th><th>Diagnostic checking</th><th>LP checked</th><th>LP released</th><th>Ringkasan</th><th aria-label="Aksi" /></tr></thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const summary = getOpsSlaSummary(student);
                    return <tr key={student.id}>
                      <td><strong>{student.name}</strong><span>{student.id} · {student.assignedMo || "MO belum ditag"}</span></td>
                      <td><SlaCell status={student.onboarding === "done" ? "done" : student.onboarding === "scheduled" ? "on-track" : "waiting"} /></td>
                      {summary.milestones.map((milestone) => <td key={milestone.id}><SlaCell status={milestone.status} deadline={milestone.deadline} /></td>)}
                      <td><SlaSummary summary={summary} /></td>
                      <td><button type="button" className="ops-sla-detail-button" onClick={() => setSelectedStudent(student)}>Detail SLA</button></td>
                    </tr>;
                  })}
                  {filteredStudents.length === 0 && <tr className="ops-sla-empty"><td colSpan={7}>Tidak ada student yang sesuai dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedStudent && <SlaDetail student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </main>
  );
}

function SlaStat({ label, value, icon: Icon, tone }) {
  return <article className={`ops-sla-stat tone-${tone}`}><span><Icon size={17} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function SlaCell({ status, deadline }) {
  return <span className={`ops-sla-status status-${status}`}><i />{STATUS_LABELS[status]}{deadline && <small>{formatDate(deadline)}</small>}</span>;
}

function SlaSummary({ summary }) {
  if (summary.overdueCount > 0) return <span className="ops-sla-summary overdue">{summary.overdueCount} overdue</span>;
  if (summary.milestones.every((milestone) => milestone.status === "done")) return <span className="ops-sla-summary complete">Semua selesai</span>;
  if (summary.milestones.every((milestone) => milestone.status === "waiting")) return <span className="ops-sla-summary waiting">Menunggu onboarding</span>;
  return <span className="ops-sla-summary track">Dalam monitoring</span>;
}

function SlaDetail({ student, onClose }) {
  const { milestones, overdueCount } = getOpsSlaSummary(student);
  return <div className="ops-sla-backdrop" role="presentation" onMouseDown={onClose}>
    <aside className="ops-sla-drawer" role="dialog" aria-modal="true" aria-labelledby="ops-sla-detail-title" onMouseDown={(event) => event.stopPropagation()}>
      <header className="ops-sla-drawer-header"><div><span>SLA MONITORING</span><h2 id="ops-sla-detail-title">{student.name}</h2><p>{student.id} · {student.email}</p></div><button type="button" className="ops-sla-close" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button></header>
      <div className={`ops-sla-drawer-summary ${overdueCount ? "has-overdue" : ""}`}><strong>{overdueCount ? `${overdueCount} milestone overdue` : "Tidak ada milestone overdue"}</strong><span>Onboarding: {student.onboarding === "done" ? "Selesai" : student.onboarding === "scheduled" ? "Terjadwal" : "Belum dilakukan"}</span></div>
      <section className="ops-sla-timeline"><h3>Timeline milestone</h3>{milestones.map((milestone) => <div className="ops-sla-timeline-row" key={milestone.id}><div><strong>{milestone.label}</strong>{milestone.deadline && <span>Deadline {formatDate(milestone.deadline)}</span>}</div><SlaCell status={milestone.status} /></div>)}</section>
      <section className="ops-sla-detail-meta"><h3>Informasi student</h3><div><span>Payment date</span><strong>{student.paymentDate}</strong></div><div><span>MO</span><strong>{student.assignedMo || "Belum ditag"}</strong></div></section>
    </aside>
  </div>;
}

function matchesSlaFilter(summary, filter) {
  if (filter === "all") return true;
  if (filter === "overdue") return summary.overdueCount > 0;
  if (filter === "waiting") return summary.milestones.every((milestone) => milestone.status === "waiting");
  if (filter === "complete") return summary.milestones.every((milestone) => milestone.status === "done");
  return summary.milestones.some((milestone) => milestone.status === "on-track");
}

function getFilterCount(filter, counts) {
  return { all: counts.all, overdue: counts.overdue, "on-track": counts.onTrack, waiting: counts.waiting, complete: counts.complete }[filter];
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function getInitials(name) {
  if (!name) return "OP";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

