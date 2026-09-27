import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  ClockAlert,
  ExternalLink,
  FileText,
  Grid2X2,
  LogOut,
  Search,
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
  { id: "activation-pending", label: "Belum aktivasi" },
  { id: "profile-incomplete", label: "Profil belum lengkap" },
];

const MOCK_OPS_OVERVIEW = {
  total: 350,
  activationPending: 200,
  profileIncomplete: 100,
  ready: 10,
};

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsDashboard({ user, onLogout }) {
  const displayName = getDisplayName(user?.name);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(mockOpsStudents);

  const dateRangeIsInvalid = Boolean(dateFrom && dateTo && dateFrom > dateTo);
  const dateFilteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (dateRangeIsInvalid) return false;

      const paymentDate = parsePaymentDate(student.paymentDate);
      const afterStart = !dateFrom || paymentDate >= dateFrom;
      const beforeEnd = !dateTo || paymentDate <= dateTo;
      return afterStart && beforeEnd;
    });
  }, [dateFrom, dateRangeIsInvalid, dateTo, students]);

  const newStudents = dateFilteredStudents.filter((student) => student.isNewStudent);
  const newStudentCount = newStudents.length;
  const readyCount = newStudents.filter(isOpsStudentReady).length;
  const attentionCount = newStudentCount - readyCount;
  const activationPendingCount = newStudents.filter(
    (student) => student.activation !== "done"
  ).length;
  const profileIncompleteCount = newStudents.filter(
    (student) => student.profile !== "done"
  ).length;
  const overviewStats = getOverviewStats({
    filteredRowCount: dateFilteredStudents.length,
    totalRowCount: students.length,
    isDateFiltered: Boolean(dateFrom || dateTo),
    isInvalid: dateRangeIsInvalid,
  });

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return dateFilteredStudents.filter((student) => {
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
        (activeFilter === "activation-pending" && student.isNewStudent && student.activation !== "done") ||
        (activeFilter === "profile-incomplete" && student.isNewStudent && student.profile !== "done");

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, dateFilteredStudents, searchKeyword]);

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
          <NavLink to="/ops/sla" className={navLinkClass}>
            <ClockAlert size={22} />
            <span>SLA monitoring</span>
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
              <h1>Welcome back, {displayName}!</h1>
              <p className="ops-page-description">
                Monitor student baru mulai dari checklist LMS, onboarding
                session, hingga learning plan.
              </p>
            </div>
            <div className="ops-sync-status">
              <span className="ops-sync-dot" aria-hidden="true" />
              <span>Data LMS terakhir diperbarui hari ini, 09.42</span>
            </div>
          </div>

          <section className="ops-readiness-overview fade-in-up" aria-label="Statistik readiness student" style={{ "--delay": "80ms" }}>
            <header className="ops-overview-header">
              <div>
                <p className="ops-overview-eyebrow">STUDENT READINESS</p>
                <h2>Statistik student</h2>
                <p>Gambaran kesiapan student dari seluruh data yang dapat dipantau Ops.</p>
              </div>
              <div className="ops-overview-total">
                <strong>{overviewStats.total}</strong>
                <span>Total student</span>
              </div>
            </header>

            <div className="ops-overview-body">
              <div className="ops-readiness-donut" style={{ "--ready-rate": `${overviewStats.readyPercent}%` }}>
                <div><strong>{overviewStats.readyPercent}%</strong><span>siap diproses</span></div>
              </div>
              <div className="ops-readiness-bars">
                <ReadinessBar
                  label="Belum aktivasi"
                  value={overviewStats.activationPending}
                  total={overviewStats.total}
                  tone="orange"
                  active={activeFilter === "activation-pending"}
                  onClick={() => handleScorecardClick("activation-pending")}
                />
                <ReadinessBar
                  label="Profil belum lengkap"
                  value={overviewStats.profileIncomplete}
                  total={overviewStats.total}
                  tone="orange"
                  active={activeFilter === "profile-incomplete"}
                  onClick={() => handleScorecardClick("profile-incomplete")}
                />
                <ReadinessBar
                  label="Siap diproses"
                  value={overviewStats.ready}
                  total={overviewStats.total}
                  tone="green"
                  active={activeFilter === "ready"}
                  onClick={() => handleScorecardClick("ready")}
                />
              </div>
            </div>

            <footer className="ops-overview-footer">
              <span>Data agregat seluruh student</span>
              <span>Kategori dapat saling overlap karena satu student bisa memiliki lebih dari satu checklist.</span>
            </footer>
          </section>

          <section className="ops-monitor-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-monitor-header">
              <div>
                <h2>Progress student baru</h2>
                <p>
                  Pantau checklist LMS dan progress onboarding student dari satu
                  tabel terpusat. Monitoring deadline untuk setiap milestone
                  tersedia di halaman SLA monitoring.
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

              <div className="ops-date-filter" aria-label="Filter payment date">
                <CalendarDays size={16} />
                <label>
                  <span>Dari</span>
                  <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </label>
                <span className="ops-date-separator">—</span>
                <label>
                  <span>Sampai</span>
                  <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </label>
                {(dateFrom || dateTo) && (
                  <button type="button" className="ops-clear-date" onClick={() => { setDateFrom(""); setDateTo(""); }}>
                    Reset
                  </button>
                )}
              </div>

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
                          ? dateFilteredStudents.length
                          : filter.id === "new-students"
                            ? newStudentCount
                            : filter.id === "ready"
                            ? readyCount
                            : filter.id === "activation-pending"
                              ? activationPendingCount
                              : filter.id === "profile-incomplete"
                                ? profileIncompleteCount
                            : attentionCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {dateRangeIsInvalid && (
              <p className="ops-date-error" role="alert">Tanggal mulai tidak boleh lebih besar dari tanggal akhir.</p>
            )}

            <div className="ops-table-wrapper">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Payment date</th>
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

function ReadinessBar({ label, value, total, tone, active, onClick }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <button
      type="button"
      className={`ops-readiness-bar tone-${tone}${active ? " active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="ops-readiness-bar-heading">
        <span><i />{label}</span>
        <strong>{value} <small>({percentage}%)</small></strong>
      </span>
      <span className="ops-readiness-track"><span style={{ width: `${percentage}%` }} /></span>
    </button>
  );
}

function getOverviewStats({ filteredRowCount, totalRowCount, isDateFiltered, isInvalid }) {
  if (isInvalid) {
    return { ...MOCK_OPS_OVERVIEW, total: 0, activationPending: 0, profileIncomplete: 0, ready: 0, readyPercent: 0 };
  }

  if (!isDateFiltered) {
    return {
      ...MOCK_OPS_OVERVIEW,
      readyPercent: Math.round((MOCK_OPS_OVERVIEW.ready / MOCK_OPS_OVERVIEW.total) * 100),
    };
  }

  const ratio = totalRowCount ? filteredRowCount / totalRowCount : 0;
  const activationPending = Math.round(MOCK_OPS_OVERVIEW.activationPending * ratio);
  const profileIncomplete = Math.round(MOCK_OPS_OVERVIEW.profileIncomplete * ratio);
  const ready = Math.round(MOCK_OPS_OVERVIEW.ready * ratio);
  const total = Math.round(MOCK_OPS_OVERVIEW.total * ratio);

  return {
    total,
    activationPending,
    profileIncomplete,
    ready,
    readyPercent: total ? Math.round((ready / total) * 100) : 0,
  };
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

function getDisplayName(name) {
  if (!name) return "Operator";
  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
}

function parsePaymentDate(value) {
  const [day, month, year] = value.split(" ");
  const monthIndex = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  }[month];

  return `${year}-${monthIndex}-${day.padStart(2, "0")}`;
}
