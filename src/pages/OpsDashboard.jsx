import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardCheck,
  ChevronDown,
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
import { isOpsStudentReady, mockOpsMOs, mockOpsStudents } from "../data/mockOpsStudents";
import "../pages/StudentBuddyDashboard.css";
import "./OpsDashboard.css";

const FILTERS = [
  { id: "all", label: "Semua student" },
  { id: "attention", label: "Perlu ditindaklanjuti" },
  { id: "ready", label: "Siap diproses" },
];

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsDashboard({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(mockOpsStudents);

  const readyCount = students.filter(isOpsStudentReady).length;
  const activationDoneCount = students.filter(
    (student) => student.activation === "done"
  ).length;
  const profileCompleteCount = students.filter(
    (student) => student.profile === "done"
  ).length;

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !keyword ||
        student.name.toLowerCase().includes(keyword) ||
        student.id.toLowerCase().includes(keyword);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "ready" && isOpsStudentReady(student)) ||
        (activeFilter === "attention" && !isOpsStudentReady(student));

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchKeyword, students]);

  function handleAssignMo(studentId, moId) {
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
                Pantau aktivasi dan kelengkapan profil student di LMS sebelum
                proses operasional dimulai.
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
              value={students.length}
              helper="Masuk dalam monitoring"
              icon={Users}
              tone="blue"
            />
            <OpsStatCard
              label="Siap diproses"
              value={readyCount}
              helper="Dua checklist selesai"
              icon={CheckCircle2}
              tone="green"
            />
            <OpsStatCard
              label="Aktivasi LMS selesai"
              value={activationDoneCount}
              helper="Checklist aktivasi sudah selesai"
              icon={ClipboardCheck}
              tone="blue"
            />
            <OpsStatCard
              label="Profil LMS lengkap"
              value={profileCompleteCount}
              helper="Checklist profil sudah lengkap"
              icon={UserCheck}
              tone="green"
            />
          </section>

          <section className="ops-monitor-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-monitor-header">
              <div>
                <h2>Kesiapan student baru</h2>
                <p>
                  Student siap diproses setelah Aktivasi LMS dan Profil LMS
                  sama-sama selesai.
                </p>
              </div>
              <span className="ops-readiness-rule">
                <CheckCircle2 size={16} /> 2 checklist wajib
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

              <div className="ops-filter-tabs" role="tablist" aria-label="Filter readiness">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    className={activeFilter === filter.id ? "active" : ""}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                    <span>
                      {filter.id === "all"
                        ? students.length
                        : filter.id === "ready"
                          ? readyCount
                          : students.length - readyCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ops-table-wrapper">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Masuk</th>
                    <th>Aktivasi LMS</th>
                    <th>Profil LMS</th>
                    <th>Readiness</th>
                    <th>MO</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const ready = isOpsStudentReady(student);
                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>{student.name}</strong>
                          <span>{student.id}</span>
                        </td>
                        <td className="ops-date-cell">{student.joinedAt}</td>
                        <td><ChecklistBadge done={student.activation === "done"} /></td>
                        <td><ChecklistBadge done={student.profile === "done"} /></td>
                        <td>
                          <span className={`ops-readiness-badge ${ready ? "ready" : "waiting"}`}>
                            {ready ? "Siap diproses" : "Menunggu checklist"}
                          </span>
                        </td>
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
                            {ready && !student.assignedMo ? "Assign MO" : "Lihat detail"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr className="ops-empty-row">
                      <td colSpan={7}>Tidak ada student yang sesuai dengan filter.</td>
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
          onAssign={handleAssignMo}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </main>
  );
}

function OpsStatCard({ label, value, helper, icon: Icon, tone }) {
  return (
    <article className={`ops-stat-card tone-${tone}`}>
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

function OpsStudentDetail({ student, mos, onAssign, onClose }) {
  const ready = isOpsStudentReady(student);
  const assignedMo = mos.find((mo) => mo.name === student.assignedMo);
  const [pendingMoId, setPendingMoId] = useState(assignedMo?.id ?? "");

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
            <div><dt>Tanggal masuk</dt><dd>{student.joinedAt}</dd></div>
            <div><dt>Assignment</dt><dd>{student.assignedTo}</dd></div>
          </dl>
        </section>

        <section className="ops-drawer-section">
          <h3>Langkah berikutnya</h3>
          <div className={`ops-next-step ${ready ? "ready" : "locked"}`}>
            {ready
              ? "Checklist lengkap. Ops dapat melanjutkan proses assign MO."
              : "Assign MO belum dapat dimulai sampai Aktivasi LMS dan Profil LMS selesai."}
          </div>
          {ready && (
            <div className="ops-assign-form">
              <label htmlFor="ops-mo-select">Assign MO</label>
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
                onClick={() => onAssign(student.id, pendingMoId)}
              >
                {student.assignedMo ? "Simpan perubahan MO" : "Assign MO"}
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
