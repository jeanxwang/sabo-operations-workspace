import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardCheck,
  ChevronDown,
  ClockAlert,
  ExternalLink,
  FileText,
  Grid2X2,
  LogOut,
  Search,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import {
  isOpsStudentReady,
  getOpsSlaSummary,
  LEARNING_SYSTEM_ASSIGN_URL,
  mockOpsMOs,
  mockOpsStudents,
} from "../data/mockOpsStudents";
import "../pages/StudentBuddyDashboard.css";
import "./OpsDashboard.css";

const FILTERS = [
  { id: "all", label: "Semua student" },
  { id: "new-students", label: "Student baru" },
  { id: "attention", label: "Checklist belum lengkap" },
  { id: "ready", label: "Checklist lengkap" },
  { id: "activation-done", label: "Aktivasi selesai" },
  { id: "profile-complete", label: "Profil lengkap" },
  { id: "sla-overdue", label: "SLA overdue" },
];

const SLA_SHORT_LABELS = {
  diagnostic: "Diagnostic",
  lpChecked: "LP checked",
  lpReleased: "LP released",
};

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsDashboard({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(mockOpsStudents);

  const newStudentCount = students.filter((student) => student.isNewStudent).length;
  const newStudents = students.filter((student) => student.isNewStudent);
  const readyCount = newStudents.filter(isOpsStudentReady).length;
  const attentionCount = newStudentCount - readyCount;
  const activationDoneCount = newStudents.filter(
    (student) => student.activation === "done"
  ).length;
  const profileCompleteCount = newStudents.filter(
    (student) => student.profile === "done"
  ).length;
  const slaOverdueMilestoneCount = newStudents.reduce(
    (total, student) => total + getOpsSlaSummary(student).overdueCount,
    0
  );
  const slaOverdueStudentCount = newStudents.filter(
    (student) => getOpsSlaSummary(student).overdueCount > 0
  ).length;

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !keyword ||
        student.name.toLowerCase().includes(keyword) ||
        student.id.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.phone.toLowerCase().includes(keyword);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "new-students" && student.isNewStudent) ||
        (activeFilter === "ready" && student.isNewStudent && isOpsStudentReady(student)) ||
        (activeFilter === "attention" && student.isNewStudent && !isOpsStudentReady(student)) ||
        (activeFilter === "activation-done" && student.isNewStudent && student.activation === "done") ||
        (activeFilter === "profile-complete" && student.isNewStudent && student.profile === "done") ||
        (activeFilter === "sla-overdue" && student.isNewStudent && getOpsSlaSummary(student).overdueCount > 0);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchKeyword, students]);

  function handleTagMo(studentId, moId) {
    const selectedMo = mockOpsMOs.find((mo) => mo.id === moId);
    if (!selectedMo) return;

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? { ...student, assignedMo: selectedMo.name }
          : student
      )
    );
    setSelectedStudent((currentStudent) =>
      currentStudent?.id === studentId
        ? { ...currentStudent, assignedMo: selectedMo.name }
        : currentStudent
    );
  }

  function handleScorecardClick(filterId) {
    setActiveFilter((currentFilter) =>
      currentFilter === filterId ? "all" : filterId
    );
    setSearchKeyword("");
  }

  return (
    <main className="dashboard-page ops-dashboard-page">
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
          <div className="ops-sidebar-section-label">
            <Users size={16} />
            <span>Monitoring New Student</span>
          </div>
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
            <strong>Ops</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="ops-content">
          <div className="ops-page-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="ops-eyebrow">NEW STUDENT READINESS</p>
              <h1>Monitor student baru</h1>
              <p className="ops-page-description">
                Pantau lifecycle student baru mulai dari checklist LMS,
                onboarding session, hingga learning plan.
              </p>
            </div>
            <div className="ops-sync-status">
              <span className="ops-sync-dot" aria-hidden="true" />
              <span>Data LMS terakhir diperbarui hari ini, 09.42</span>
            </div>
          </div>

          <section className="ops-stat-grid" aria-label="Ringkasan student baru">
            <OpsStatCard
              label="Student baru"
              value={newStudentCount}
              helper="Masuk dalam monitoring"
              icon={Users}
              tone="blue"
              interactive
              onClick={() => handleScorecardClick("new-students")}
              active={activeFilter === "new-students"}
            />
            <OpsStatCard
              label="Siap diproses"
              value={readyCount}
              helper="Dua checklist selesai"
              icon={CheckCircle2}
              tone="green"
              interactive
              onClick={() => handleScorecardClick("ready")}
              active={activeFilter === "ready"}
            />
            <OpsStatCard
              label="Aktivasi LMS selesai"
              value={activationDoneCount}
              helper="Checklist aktivasi sudah selesai"
              icon={ClipboardCheck}
              tone="blue"
              interactive
              onClick={() => handleScorecardClick("activation-done")}
              active={activeFilter === "activation-done"}
            />
            <OpsStatCard
              label="Profil LMS lengkap"
              value={profileCompleteCount}
              helper="Checklist profil sudah lengkap"
              icon={UserCheck}
              tone="green"
              interactive
              onClick={() => handleScorecardClick("profile-complete")}
              active={activeFilter === "profile-complete"}
            />
            <OpsStatCard
              label="SLA overdue"
              value={slaOverdueStudentCount}
              helper={`${slaOverdueMilestoneCount} milestone melewati deadline`}
              icon={ClockAlert}
              tone="red"
              interactive
              onClick={() => handleScorecardClick("sla-overdue")}
              active={activeFilter === "sla-overdue"}
            />
          </section>

          <section className="ops-monitor-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-monitor-header">
              <div>
                <h2>Progress student baru</h2>
                <p>
                  Pantau checklist LMS dan progress onboarding student dari satu
                  tabel terpusat. SLA: diagnostic D+1, LP checked D+2, dan LP
                  released D+3 setelah onboarding selesai.
                </p>
              </div>
              <span className="ops-readiness-rule">
                <CheckCircle2 size={16} /> Gate awal: Aktivasi + Profil
              </span>
            </header>

            <div className="ops-toolbar">
              <label className="ops-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Cari nama atau student ID..."
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                />
              </label>

              <div className="ops-toolbar-filter-row">
                <div className="ops-filter-tabs" role="tablist" aria-label="Filter student">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      role="tab"
                      aria-selected={activeFilter === filter.id}
                      className={activeFilter === filter.id ? "active" : ""}
                      onClick={() => handleScorecardClick(filter.id)}
                    >
                      {filter.label}
                      <span>
                        {filter.id === "all"
                          ? students.length
                          : filter.id === "new-students"
                            ? newStudentCount
                            : filter.id === "ready"
                            ? readyCount
                            : filter.id === "activation-done"
                              ? activationDoneCount
                              : filter.id === "profile-complete"
                                ? profileCompleteCount
                                : filter.id === "sla-overdue"
                                  ? slaOverdueStudentCount
                                  : attentionCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ops-table-wrapper">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Payment date</th>
                    <th>SLA</th>
                    <th>Aktivasi LMS</th>
                    <th>Profil LMS</th>
                    <th>Onboarding session</th>
                    <th>Diagnostic checking</th>
                    <th>LP checked</th>
                    <th>LP released</th>
                    <th>MO tag</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>{student.name}</strong>
                          <span>{student.id}</span>
                        </td>
                        <td className="ops-contact-cell">{student.email}</td>
                        <td className="ops-contact-cell">{student.phone}</td>
                        <td className="ops-date-cell">{student.paymentDate}</td>
                        <td><SlaSummaryCell student={student} /></td>
                        <td><ChecklistBadge done={student.activation === "done"} /></td>
                        <td><ChecklistBadge done={student.profile === "done"} /></td>
                        <td><OpsStatusBadge status={student.onboarding} /></td>
                        <td><OpsStatusBadge status={student.diagnostic} /></td>
                        <td><OpsStatusBadge status={student.lpChecked} /></td>
                        <td><OpsStatusBadge status={student.lpReleased} /></td>
                        <td>
                          <span className={`ops-assignment-cell ${student.assignedMo ? "assigned" : "unassigned"}`}>
                            {student.assignedMo || "Belum diassign"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="ops-detail-button"
                            onClick={() => setSelectedStudent(student)}
                          >
                            Lihat detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr className="ops-empty-row">
                      <td colSpan={13}>Tidak ada student yang sesuai dengan filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedStudent && (
        <OpsStudentDetail
          student={selectedStudent}
          mos={mockOpsMOs}
          onTagMo={handleTagMo}
          learningSystemUrl={LEARNING_SYSTEM_ASSIGN_URL}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </main>
  );
}

function OpsStatCard({ label, value, helper, icon: Icon, tone, interactive, onClick, active }) {
  const className = `ops-stat-card tone-${tone}${interactive ? " interactive" : ""}${active ? " active" : ""}`;

  return (
    <article
      className={className}
      onClick={onClick}
      onKeyDown={(event) => {
        if (interactive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? active : undefined}
    >
      <div className="ops-stat-icon"><Icon size={18} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}

function ChecklistBadge({ done }) {
  return (
    <span className={`ops-checklist-badge ${done ? "done" : "pending"}`}>
      <span className="ops-checklist-indicator" aria-hidden="true" />
      {done ? "Selesai" : "Belum selesai"}
    </span>
  );
}

const OPS_STATUS_LABELS = {
  done: "Selesai",
  pending: "Belum",
  scheduled: "Terjadwal",
  waiting: "Menunggu onboarding",
  "on-track": "On track",
  overdue: "Overdue",
};

function OpsStatusBadge({ status }) {
  const label = OPS_STATUS_LABELS[status] ?? status;

  return (
    <span className={`ops-status-badge status-${status}`}>
      <span className="ops-status-indicator" aria-hidden="true" />
      {label}
    </span>
  );
}

function SlaSummaryCell({ student }) {
  const { milestones, overdueCount } = getOpsSlaSummary(student);
  const overdueMilestones = milestones.filter((milestone) => milestone.status === "overdue");

  if (overdueCount === 0) {
    return <span className="ops-sla-cell-clear">Tidak ada overdue</span>;
  }

  return (
    <div className="ops-sla-cell-overdue">
      <strong>{overdueCount} overdue</strong>
      <span>{overdueMilestones.map((milestone) => SLA_SHORT_LABELS[milestone.id]).join(", ")}</span>
    </div>
  );
}

function ProgressRow({ label, status, deadline }) {
  return (
    <div className="ops-progress-row">
      <div>
        <span>{label}</span>
        {deadline && <small>Deadline: {formatDate(deadline)}</small>}
      </div>
      <OpsStatusBadge status={status} />
    </div>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function OpsStudentDetail({ student, mos, onTagMo, learningSystemUrl, onClose }) {
  const ready = isOpsStudentReady(student);
  const assignedMo = mos.find((mo) => mo.name === student.assignedMo);
  const [pendingMoId, setPendingMoId] = useState(assignedMo?.id ?? "");
  const learningSystemHref = `${learningSystemUrl}?student_id=${encodeURIComponent(student.id)}`;
  const { milestones } = getOpsSlaSummary(student);

  return (
    <div className="ops-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="ops-detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ops-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ops-drawer-header">
          <div>
            <span className="ops-drawer-kicker">Student detail</span>
            <h2 id="ops-detail-title">{student.name}</h2>
            <p>{student.id} · {student.email}</p>
          </div>
          <button type="button" className="ops-drawer-close" aria-label="Tutup detail" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="ops-drawer-readiness">
          <span className={`ops-readiness-badge ${ready ? "ready" : "waiting"}`}>
            {ready ? "Siap diproses" : "Menunggu checklist"}
          </span>
          <p>
            {ready
              ? "Aktivasi dan profil LMS sudah lengkap. Student dapat masuk ke proses Ops berikutnya."
              : "Ops belum bekerja sampai kedua checklist LMS selesai."}
          </p>
        </div>

        <section className="ops-drawer-section">
          <h3>Checklist LMS</h3>
          <div className="ops-drawer-checklist">
            <ChecklistRow label="Aktivasi LMS" done={student.activation === "done"} />
            <ChecklistRow label="Kelengkapan profil LMS" done={student.profile === "done"} />
          </div>
        </section>

        <section className="ops-drawer-section">
          <h3>Informasi monitoring</h3>
          <dl className="ops-drawer-meta">
            <div><dt>Email</dt><dd>{student.email}</dd></div>
            <div><dt>No. HP</dt><dd>{student.phone}</dd></div>
            <div><dt>Payment date</dt><dd>{student.paymentDate}</dd></div>
            <div><dt>Tanggal masuk</dt><dd>{student.joinedAt}</dd></div>
            <div><dt>Ops owner</dt><dd>{student.assignedTo}</dd></div>
          </dl>
        </section>

        <section className="ops-drawer-section">
          <h3>Progress setelah onboarding</h3>
          <div className="ops-drawer-progress-list">
            <ProgressRow label="Onboarding session" status={student.onboarding} />
            {milestones.map((milestone) => (
              <ProgressRow
                key={milestone.id}
                label={milestone.label}
                status={milestone.status}
                deadline={milestone.deadline}
              />
            ))}
          </div>
        </section>

        <section className="ops-drawer-section">
          <h3>Assignment MO</h3>
          <div className={`ops-next-step ${ready ? "ready" : "locked"}`}>
            {ready
              ? "Checklist LMS lengkap. Assignment MO dilakukan di Learning System; SABO hanya menyimpan tag mentor."
              : "Assignment MO belum dapat dilakukan sampai Aktivasi LMS dan Profil LMS selesai."}
          </div>
          {ready && (
            <div className="ops-assign-form">
              <a
                className="ops-learning-system-link"
                href={learningSystemHref}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} />
                Buka Learning System untuk assign MO
              </a>
              <label htmlFor="ops-mo-select">Tag MO di SABO</label>
              <div className="ops-select-wrapper">
                <select
                  id="ops-mo-select"
                  value={pendingMoId}
                  onChange={(event) => setPendingMoId(event.target.value)}
                >
                  <option value="" disabled>Pilih MO</option>
                  {mos.map((mo) => (
                    <option key={mo.id} value={mo.id}>
                      {mo.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </div>
              {student.assignedMo && (
                <small>MO saat ini: {student.assignedMo}</small>
              )}
              <button
                type="button"
                className="ops-assign-button"
                disabled={!pendingMoId}
                onClick={() => onTagMo(student.id, pendingMoId)}
              >
                {student.assignedMo ? "Simpan perubahan tag" : "Simpan tag MO"}
              </button>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}

function ChecklistRow({ label, done }) {
  return (
    <div className="ops-drawer-checklist-row">
      <span className={`ops-drawer-check-icon ${done ? "done" : "pending"}`}>
        {done ? <CheckCircle2 size={17} /> : <span />}
      </span>
      <span>{label}</span>
      <strong>{done ? "Selesai" : "Belum selesai"}</strong>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "OP";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
