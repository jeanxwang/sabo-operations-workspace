import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  LogOut,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockMoHandoverForms } from "../data/mockMoHandoverForms";
import {
  getChecklistProgress,
  mockMoOnboardingChecklists,
  ONBOARDING_CHECKLIST_ITEMS,
} from "../data/mockMoOnboardingChecklists";
import { mockMoStudentProfiles } from "../data/mockMoStudentProfiles";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";
import "./MOStudents.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

function buildStudentRecords() {
  const profilesById = new Map(mockMoStudentProfiles.map((profile) => [profile.id, profile]));
  const checklistsById = new Map(mockMoOnboardingChecklists.map((record) => [record.studentId, record]));

  return mockMoHandoverForms.map((handover) => ({
    ...handover,
    profile: profilesById.get(handover.studentId),
    onboarding: checklistsById.get(handover.studentId),
  }));
}

export default function MOStudents({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [records, setRecords] = useState(buildStudentRecords);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState("handover");

  const selectedStudent = records.find((record) => record.studentId === selectedStudentId);
  const onboardingDoneCount = records.filter((record) => record.onboarding?.checklist.session).length;
  const checklistDoneCount = records.filter((record) => getChecklistProgress(record.onboarding).isComplete).length;

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) =>
      [record.studentName, record.studentId, record.packageName, record.program]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [records, searchKeyword]);

  function updateChecklist(itemId, checked) {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.studentId === selectedStudentId
          ? {
              ...record,
              onboarding: {
                ...record.onboarding,
                checklist: { ...record.onboarding.checklist, [itemId]: checked },
              },
            }
          : record
      )
    );
  }

  function updateNotes(notes) {
    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.studentId === selectedStudentId
          ? { ...record, onboarding: { ...record.onboarding, notes } }
          : record
      )
    );
  }

  function openDetail(studentId, detail) {
    setSelectedStudentId(studentId);
    setSelectedDetail(detail);
  }

  function closeDetail() {
    setSelectedStudentId(null);
    setSelectedDetail(null);
  }

  return (
    <main className="dashboard-page mo-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/mo/students" end className={navLinkClass}>
            <Users size={22} />
            <span>Data Onboarding</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "MO Team"}</strong>
            <small>Mentor Onboarding</small>
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
            <strong>Mentor Onboarding</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="mo-content">
          <div className="mo-page-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="mo-eyebrow">MENTOR ONBOARDING</p>
              <h1>Data onboarding student</h1>
              <p>
                Satu tabel untuk melihat form handover, profil SLMS, dan progres
                onboarding setiap student.
              </p>
            </div>
            <div className="mo-read-only-note mo-editable-note">
              <ClipboardCheck size={16} /> Checklist bisa diperbarui
            </div>
          </div>

          <section className="mo-summary-grid mo-student-summary" aria-label="Ringkasan data onboarding">
            <SummaryCard label="Total student" value={records.length} icon={Users} tone="blue" />
            <SummaryCard label="Sesi sudah dilakukan" value={onboardingDoneCount} icon={CheckCircle2} tone="green" />
            <SummaryCard label="Checklist selesai" value={checklistDoneCount} icon={ClipboardCheck} tone="purple" />
          </section>

          <section className="mo-handover-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="mo-card-header">
              <div>
                <h2>Daftar student onboarding</h2>
                <p>Ringkasan data student dari seluruh tahap onboarding MO.</p>
              </div>
              <span>{filteredStudents.length} student</span>
            </header>

            <div className="mo-toolbar">
              <label className="mo-search">
                <Search size={18} />
                <input type="search" placeholder="Cari nama, ID, paket, atau program..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} />
              </label>
            </div>

            <div className="mo-table-wrapper">
              <table className="mo-table mo-student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>No. HP</th>
                    <th>Payment date</th>
                    <th>Form handover</th>
                    <th>Profil SLMS</th>
                    <th>Onboarding</th>
                    <th>Checklist</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((record) => {
                    const progress = getChecklistProgress(record.onboarding);
                    return (
                      <tr key={record.studentId}>
                        <td>
                          <strong>{record.studentName}</strong>
                          <span>{record.studentId} · {record.packageName}</span>
                        </td>
                        <td className="mo-contact-cell">{record.email}</td>
                        <td className="mo-contact-cell">{record.phone}</td>
                        <td className="mo-date-cell">{record.paymentDate}</td>
                        <td><StatusPill label="Lengkap" tone="complete" /></td>
                        <td><StatusPill label="Lengkap" tone="complete" /></td>
                        <td>{record.onboarding.onboardingDate ? <StatusPill label="Sudah dilakukan" tone="complete" /> : <StatusPill label="Belum dilakukan" tone="pending" />}</td>
                        <td>
                          <div className="mo-progress-cell">
                            <div className="mo-progress-track"><span style={{ width: `${(progress.completed / progress.total) * 100}%` }} /></div>
                            <strong>{progress.completed}/{progress.total}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="mo-detail-actions">
                            <button type="button" className="mo-detail-action" onClick={() => openDetail(record.studentId, "handover")}>
                              <FileText size={13} /> Lihat handover
                            </button>
                            <button type="button" className="mo-detail-action" onClick={() => openDetail(record.studentId, "profile")}>
                              <User size={13} /> Lihat profil SLMS
                            </button>
                            <button type="button" className="mo-detail-action" onClick={() => openDetail(record.studentId, "checklist")}>
                              <ClipboardCheck size={13} /> Lihat checklist
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && <tr className="mo-empty-row"><td colSpan={9}>Tidak ada student yang sesuai.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedStudent && (
        <StudentDetailDrawer
          student={selectedStudent}
          activeSection={selectedDetail}
          onSectionChange={setSelectedDetail}
          onClose={closeDetail}
          onToggle={updateChecklist}
          onNotesChange={updateNotes}
        />
      )}
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return <article className={`mo-summary-card tone-${tone}`}><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function StatusPill({ label, tone }) {
  return <span className={`mo-status ${tone}`}><span />{label}</span>;
}

function StudentDetailDrawer({ student, activeSection, onSectionChange, onClose, onToggle, onNotesChange }) {
  const progress = getChecklistProgress(student.onboarding);
  const profile = student.profile;

  return (
    <div className="mo-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="mo-drawer mo-student-drawer" role="dialog" aria-modal="true" aria-labelledby="mo-student-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="mo-drawer-header">
          <div><span className="mo-drawer-eyebrow">DATA ONBOARDING · {student.studentId}</span><h2 id="mo-student-detail-title">{student.studentName}</h2><p>{student.packageName} · {student.program}</p></div>
          <button type="button" className="mo-close-button" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="mo-detail-status-grid">
          <StatusPill label="Handover lengkap" tone="complete" />
          <StatusPill label="Profil SLMS lengkap" tone="complete" />
          <StatusPill label={student.onboarding.onboardingDate ? "Onboarding dilakukan" : "Onboarding belum dilakukan"} tone={student.onboarding.onboardingDate ? "complete" : "pending"} />
        </div>

        <nav className="mo-detail-tabs" aria-label="Detail data student">
          <button type="button" className={activeSection === "handover" ? "active" : ""} onClick={() => onSectionChange("handover")}><FileText size={14} /> Handover</button>
          <button type="button" className={activeSection === "profile" ? "active" : ""} onClick={() => onSectionChange("profile")}><User size={14} /> Profil SLMS</button>
          <button type="button" className={activeSection === "checklist" ? "active" : ""} onClick={() => onSectionChange("checklist")}><ClipboardCheck size={14} /> Checklist</button>
        </nav>

        {activeSection === "handover" && <HandoverDetailSection student={student} />}
        {activeSection === "profile" && <ProfileDetailSection profile={profile} />}
        {activeSection === "checklist" && (
          <ChecklistDetailSection student={student} progress={progress} onToggle={onToggle} onNotesChange={onNotesChange} />
        )}

        <div className="mo-student-drawer-footer"><FileText size={15} /> Data handover dan profil bersumber dari sistem terkait. Checklist dapat diperbarui oleh MO.</div>
      </aside>
    </div>
  );
}

function HandoverDetailSection({ student }) {
  return (
    <DetailSection title="Isian form handover">
      <DetailItem label="Email" value={student.email} />
      <DetailItem label="No. HP" value={student.phone} />
      <DetailItem label="Produk" value={student.packageName} />
      <DetailItem label="Program" value={student.program} />
      <DetailItem label="Payment date" value={student.paymentDate} />
      <DetailItem label="Diteruskan pada" value={student.submittedAt} />
      <DetailItem label="Diteruskan oleh" value={student.submittedBy} />
      <DetailItem label="Pendidikan saat ini" value={student.currentEducation} />
      <DetailItem label="Jenjang tujuan" value={student.targetDegree} />
      <DetailItem label="Target intake" value={student.targetIntake} />
      <DetailItem label="Jurusan tujuan" value={student.intendedMajor} />
      <DetailItem label="Negara tujuan" value={student.targetCountries} />
      <DetailItem label="Universitas tujuan" value={student.targetUniversities} />
      <DetailItem label="Range budget" value={student.budgetRange} />
      <DetailItem label="English level" value={student.englishLevel} />
      <div className="mo-note-block"><span>Tujuan student</span><p>{student.studentGoals}</p></div>
      <div className="mo-note-block"><span>Catatan tambahan</span><p>{student.additionalNotes}</p></div>
    </DetailSection>
  );
}

function ProfileDetailSection({ profile }) {
  return (
    <DetailSection title="Isian profil SLMS">
      <DetailItem label="Email" value={profile.email} />
      <DetailItem label="No. HP" value={profile.phone} />
      <DetailItem label="Tanggal lahir" value={profile.dateOfBirth} />
      <DetailItem label="Kota domisili" value={profile.city} />
      <DetailItem label="Pendidikan saat ini" value={profile.currentEducation} />
      <DetailItem label="Jenjang tujuan" value={profile.targetDegree} />
      <DetailItem label="Target intake" value={profile.targetIntake} />
      <DetailItem label="Jurusan tujuan" value={profile.intendedMajor} />
      <DetailItem label="Negara tujuan" value={profile.targetCountries} />
      <DetailItem label="English level" value={profile.englishLevel} />
      <DetailItem label="Kontak orang tua" value={profile.parentContact} />
      <div className="mo-note-block"><span>Minat</span><p>{profile.interests}</p></div>
      <div className="mo-note-block"><span>Tujuan student</span><p>{profile.studentGoals}</p></div>
    </DetailSection>
  );
}

function ChecklistDetailSection({ student, progress, onToggle, onNotesChange }) {
  return (
    <section className="mo-detail-section">
      <div className="mo-drawer-section-heading"><div><h3>Onboarding checklist</h3><span>{progress.completed} dari {progress.total} selesai</span></div><strong>{Math.round((progress.completed / progress.total) * 100)}%</strong></div>
      <div className="mo-checklist-items">
        {ONBOARDING_CHECKLIST_ITEMS.map((item) => (
          <label className={`mo-checklist-item ${student.onboarding.checklist[item.id] ? "checked" : ""}`} key={item.id}>
            <input type="checkbox" checked={Boolean(student.onboarding.checklist[item.id])} onChange={(event) => onToggle(item.id, event.target.checked)} />
            <span className="mo-check-box"><Check size={14} /></span>
            <span className="mo-checklist-copy"><strong>{item.label}</strong><small>{item.helper}</small></span>
          </label>
        ))}
      </div>
      <label className="mo-checklist-notes"><span>Catatan hasil onboarding</span><textarea rows="4" placeholder="Tulis ringkasan atau follow-up penting..." value={student.onboarding.notes} onChange={(event) => onNotesChange(event.target.value)} /></label>
    </section>
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
