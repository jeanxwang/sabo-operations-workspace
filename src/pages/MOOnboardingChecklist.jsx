import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
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
  getChecklistProgress,
  mockMoOnboardingChecklists,
  ONBOARDING_CHECKLIST_ITEMS,
} from "../data/mockMoOnboardingChecklists";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";
import "./MOOnboardingChecklist.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function MOOnboardingChecklist({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [records, setRecords] = useState(mockMoOnboardingChecklists);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const selectedRecord = records.find((record) => record.studentId === selectedRecordId);
  const completeCount = records.filter((record) => getChecklistProgress(record).isComplete).length;
  const completedSessionCount = records.filter((record) => record.checklist.session).length;

  const filteredRecords = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) =>
      [record.studentName, record.studentId, record.packageName]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [records, searchKeyword]);

  function updateSelectedChecklist(itemId, checked) {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.studentId === selectedRecordId
          ? {
              ...record,
              checklist: { ...record.checklist, [itemId]: checked },
            }
          : record
      )
    );
  }

  function updateSelectedNotes(notes) {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.studentId === selectedRecordId ? { ...record, notes } : record
      )
    );
  }

  return (
    <main className="dashboard-page mo-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/mo/handover" className={navLinkClass}>
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
              <p className="mo-eyebrow">ONBOARDING PROGRESS</p>
              <h1>Onboarding checklist</h1>
              <p>
                Tandai langkah onboarding yang sudah dilakukan bersama student dan
                simpan catatan penting dari sesi tersebut.
              </p>
            </div>
            <div className="mo-read-only-note mo-editable-note">
              <ClipboardCheck size={16} /> Bisa diperbarui
            </div>
          </div>

          <section className="mo-summary-grid mo-checklist-summary" aria-label="Ringkasan onboarding">
            <SummaryCard label="Total student" value={records.length} icon={Users} tone="blue" />
            <SummaryCard label="Sesi sudah dilakukan" value={completedSessionCount} icon={CheckCircle2} tone="green" />
            <SummaryCard label="Checklist selesai" value={completeCount} icon={ClipboardCheck} tone="purple" />
          </section>

          <section className="mo-handover-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="mo-card-header">
              <div>
                <h2>Daftar onboarding student</h2>
                <p>Checklist dibuat dan diperbarui oleh MO setelah sesi onboarding.</p>
              </div>
              <span>{filteredRecords.length} student</span>
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
              <table className="mo-table mo-checklist-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Onboarding</th>
                    <th>Progress checklist</th>
                    <th>Status</th>
                    <th>Update terakhir</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const progress = getChecklistProgress(record);
                    return (
                      <tr key={record.studentId}>
                        <td>
                          <strong>{record.studentName}</strong>
                          <span>{record.studentId} · {record.packageName}</span>
                        </td>
                        <td className="mo-date-cell">{record.onboardingDate || "Belum dilakukan"}</td>
                        <td>
                          <div className="mo-progress-cell">
                            <div className="mo-progress-track"><span style={{ width: `${(progress.completed / progress.total) * 100}%` }} /></div>
                            <strong>{progress.completed}/{progress.total}</strong>
                          </div>
                        </td>
                        <td><ChecklistStatus progress={progress} /></td>
                        <td className="mo-muted-cell">{record.lastUpdated || "Belum ada update"}</td>
                        <td>
                          <button type="button" className="mo-detail-button" onClick={() => setSelectedRecordId(record.studentId)}>
                            Buka checklist
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr className="mo-empty-row"><td colSpan={6}>Tidak ada student yang sesuai.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedRecord && (
        <ChecklistDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecordId(null)}
          onToggle={updateSelectedChecklist}
          onNotesChange={updateSelectedNotes}
        />
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

function ChecklistStatus({ progress }) {
  return (
    <span className={`mo-status ${progress.isComplete ? "complete" : "incomplete"}`}>
      <span />{progress.isComplete ? "Selesai" : "Belum selesai"}
    </span>
  );
}

function ChecklistDrawer({ record, onClose, onToggle, onNotesChange }) {
  const progress = getChecklistProgress(record);

  return (
    <div className="mo-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="mo-drawer mo-checklist-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mo-checklist-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="mo-drawer-header">
          <div>
            <span className="mo-drawer-eyebrow">ONBOARDING CHECKLIST · {record.studentId}</span>
            <h2 id="mo-checklist-title">{record.studentName}</h2>
            <p>{record.packageName} · {record.onboardingDate || "Tanggal belum diisi"}</p>
          </div>
          <button type="button" className="mo-close-button" aria-label="Tutup checklist" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="mo-checklist-progress-header">
          <div>
            <strong>{progress.completed} dari {progress.total} selesai</strong>
            <span>Checklist dapat diperbarui setelah sesi onboarding berlangsung.</span>
          </div>
          <span className={`mo-checklist-percent ${progress.isComplete ? "complete" : ""}`}>
            {Math.round((progress.completed / progress.total) * 100)}%
          </span>
        </div>

        <div className="mo-checklist-items">
          {ONBOARDING_CHECKLIST_ITEMS.map((item) => (
            <label className={`mo-checklist-item ${record.checklist[item.id] ? "checked" : ""}`} key={item.id}>
              <input
                type="checkbox"
                checked={Boolean(record.checklist[item.id])}
                onChange={(event) => onToggle(item.id, event.target.checked)}
              />
              <span className="mo-check-box"><Check size={14} /></span>
              <span className="mo-checklist-copy">
                <strong>{item.label}</strong>
                <small>{item.helper}</small>
              </span>
            </label>
          ))}
        </div>

        <section className="mo-checklist-notes">
          <label htmlFor="mo-onboarding-notes">Catatan hasil onboarding</label>
          <textarea
            id="mo-onboarding-notes"
            rows="5"
            placeholder="Tulis ringkasan atau follow-up penting untuk student..."
            value={record.notes}
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </section>

        <div className="mo-checklist-drawer-footer">
          <span><ClipboardList size={15} /> Perubahan tersimpan otomatis di sesi ini</span>
          <button type="button" className="mo-primary-button" onClick={onClose}>Selesai</button>
        </div>
      </aside>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "MO";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

