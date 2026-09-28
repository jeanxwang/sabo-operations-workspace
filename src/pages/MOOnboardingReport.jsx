import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, LogOut, Save, Send, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockMoHandoverForms } from "../data/mockMoHandoverForms";
import { mockMoStudentProfiles } from "../data/mockMoStudentProfiles";
import { mockMoOnboardingChecklists, ONBOARDING_CHECKLIST_ITEMS } from "../data/mockMoOnboardingChecklists";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";
import "./MOOnboardingReport.css";

const REPORT_DRAFT_PREFIX = "mo_onboarding_report_draft_";
const REPORT_SUBMITTED_PREFIX = "mo_onboarding_report_";

const INITIAL_REPORT = {
  onboardingDate: "",
  sessionChannel: "Video call",
  attendance: "Hadir",
  sessionDuration: "60 menit",
  summary: "",
  currentCondition: "",
  goals: "",
  strengths: "",
  concerns: "",
  diagnosticResult: "",
  readiness: "Sedang",
  recommendedNextSteps: "",
  followUpDate: "",
  priority: "Normal",
  internalNotes: "",
  checklist: {
    session: false,
    "profile-review": false,
    expectation: false,
    "next-step": false,
    notes: false,
  },
};

function findStudent(studentId) {
  const handover = mockMoHandoverForms.find((record) => record.studentId === studentId);
  const profile = mockMoStudentProfiles.find((record) => record.id === studentId);
  const onboarding = mockMoOnboardingChecklists.find((record) => record.studentId === studentId);
  if (!handover) return null;
  return { ...handover, profile, onboarding };
}

export default function MOOnboardingReport({ user, onLogout }) {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = useMemo(() => findStudent(studentId), [studentId]);
  const [form, setForm] = useState(INITIAL_REPORT);
  const [saveMessage, setSaveMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!student) return;
    const savedReport = localStorage.getItem(`${REPORT_SUBMITTED_PREFIX}${student.studentId}`);
    const savedDraft = localStorage.getItem(`${REPORT_DRAFT_PREFIX}${student.studentId}`);
    const savedData = savedReport || savedDraft;

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setForm({ ...INITIAL_REPORT, ...parsed.form, checklist: { ...INITIAL_REPORT.checklist, ...(parsed.form?.checklist || {}) } });
        setSubmitted(Boolean(parsed.status === "submitted"));
      } catch {
        setForm(INITIAL_REPORT);
      }
    } else {
      setForm({
        ...INITIAL_REPORT,
        checklist: { ...INITIAL_REPORT.checklist, ...(student.onboarding?.checklist || {}) },
      });
    }
  }, [student]);

  if (!student) {
    return (
      <main className="dashboard-page mo-page">
        <section className="mo-report-not-found">
          <h1>Student tidak ditemukan</h1>
          <button type="button" className="mo-primary-button" onClick={() => navigate("/mo/students")}>Kembali ke data onboarding</button>
        </section>
      </main>
    );
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaveMessage("");
  }

  function toggleChecklist(itemId) {
    setForm((current) => ({
      ...current,
      checklist: { ...current.checklist, [itemId]: !current.checklist[itemId] },
    }));
    setSaveMessage("");
  }

  function saveDraft() {
    localStorage.setItem(`${REPORT_DRAFT_PREFIX}${student.studentId}`, JSON.stringify({ status: "draft", form, updatedAt: new Date().toISOString() }));
    localStorage.removeItem(`${REPORT_SUBMITTED_PREFIX}${student.studentId}`);
    setSaveMessage("Draft tersimpan. Anda masih dapat melanjutkan pengisian.");
  }

  function submitReport(event) {
    event.preventDefault();
    const requiredFields = ["onboardingDate", "summary", "currentCondition", "diagnosticResult", "recommendedNextSteps"];
    const hasMissingField = requiredFields.some((field) => !form[field].trim());
    if (hasMissingField) {
      setSaveMessage("Lengkapi bagian bertanda * sebelum submit report.");
      return;
    }

    localStorage.setItem(`${REPORT_SUBMITTED_PREFIX}${student.studentId}`, JSON.stringify({ status: "submitted", form, submittedAt: new Date().toISOString() }));
    localStorage.removeItem(`${REPORT_DRAFT_PREFIX}${student.studentId}`);
    setSubmitted(true);
    setSaveMessage("Report onboarding berhasil disubmit.");
  }

  return (
    <main className="dashboard-page mo-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <button type="button" className="mo-report-sidebar-back" onClick={() => navigate("/mo/students")}><ArrowLeft size={18} /><span>Data Onboarding</span></button>
        </nav>
        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span><strong>{user?.name || "MO Team"}</strong><small>Mentor Onboarding</small></span>
          <button type="button" className="sidebar-logout-button" aria-label="Keluar" title="Keluar" onClick={onLogout}><LogOut size={17} /></button>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs"><span>SABO Operations</span><span className="breadcrumb-separator">›</span><span>Mentor Onboarding</span><span className="breadcrumb-separator">›</span><strong>Report onboarding</strong></div>
          <TopbarActions />
        </header>

        <section className="mo-report-content">
          <button type="button" className="mo-back-link" onClick={() => navigate("/mo/students")}><ArrowLeft size={16} /> Kembali ke data onboarding</button>
          <div className="mo-report-heading">
            <div><p className="mo-eyebrow">REPORT ONBOARDING · {student.studentId}</p><h1>Catat hasil onboarding student</h1><p>Gunakan data handover dan profil SLMS sebagai referensi saat mengisi hasil sesi.</p></div>
            <div className={`mo-report-state ${submitted ? "submitted" : ""}`}>{submitted ? <CheckCircle2 size={16} /> : <FileText size={16} />} {submitted ? "Report sudah disubmit" : "Belum disubmit"}</div>
          </div>

          <div className="mo-report-layout">
            <ReferencePanel student={student} />
            <form className="mo-report-form" onSubmit={submitReport}>
              <section className="mo-form-section">
                <FormSectionHeading number="01" icon={ClipboardCheck} title="Informasi sesi" description="Catat konteks dasar pelaksanaan onboarding." />
                <div className="mo-form-grid two-columns">
                  <Field label="Tanggal onboarding *" name="onboardingDate" type="date" value={form.onboardingDate} onChange={updateField} disabled={submitted} />
                  <SelectField label="Channel sesi" name="sessionChannel" value={form.sessionChannel} onChange={updateField} disabled={submitted} options={["Video call", "Offline", "Telepon"]} />
                  <SelectField label="Kehadiran student" name="attendance" value={form.attendance} onChange={updateField} disabled={submitted} options={["Hadir", "Hadir sebagian", "Tidak hadir"]} />
                  <SelectField label="Durasi sesi" name="sessionDuration" value={form.sessionDuration} onChange={updateField} disabled={submitted} options={["30 menit", "45 menit", "60 menit", "> 60 menit"]} />
                </div>
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="02" icon={Users} title="Hasil onboarding" description="Dokumentasikan percakapan dan pemahaman MO terhadap kondisi student." />
                <TextAreaField label="Ringkasan sesi *" name="summary" value={form.summary} onChange={updateField} disabled={submitted} placeholder="Contoh: Student memahami alur mentoring, timeline aplikasi, dan peran MO selama program." />
                <TextAreaField label="Kondisi student saat ini *" name="currentCondition" value={form.currentCondition} onChange={updateField} disabled={submitted} placeholder="Ceritakan kondisi akademik, kesiapan, atau konteks penting yang ditemukan." />
                <div className="mo-form-grid two-columns">
                  <TextAreaField label="Tujuan dan ekspektasi student" name="goals" value={form.goals} onChange={updateField} disabled={submitted} placeholder="Apa yang ingin dicapai student?" />
                  <TextAreaField label="Kekuatan / aset student" name="strengths" value={form.strengths} onChange={updateField} disabled={submitted} placeholder="Contoh: aktif organisasi, target sudah jelas, portfolio kuat." />
                </div>
                <TextAreaField label="Concern atau hambatan" name="concerns" value={form.concerns} onChange={updateField} disabled={submitted} placeholder="Tuliskan risiko, hambatan, atau hal yang perlu diperhatikan tim." />
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="03" icon={ClipboardCheck} title="Onboarding checklist" description="Checklist ini menjadi bagian dari report dan disimpan bersama hasil sesi." />
                <div className="mo-report-checklist-items">
                  {ONBOARDING_CHECKLIST_ITEMS.map((item) => (
                    <label className={`mo-report-checklist-item ${form.checklist[item.id] ? "checked" : ""}`} key={item.id}>
                      <input type="checkbox" checked={Boolean(form.checklist[item.id])} onChange={() => toggleChecklist(item.id)} disabled={submitted} />
                      <span className="mo-report-check-box">{form.checklist[item.id] ? "✓" : ""}</span>
                      <span><strong>{item.label}</strong><small>{item.helper}</small></span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="04" icon={FileText} title="Diagnostic screening" description="Simpan hasil screening awal untuk menjadi dasar learning plan." />
                <TextAreaField label="Hasil diagnostic / screening awal *" name="diagnosticResult" value={form.diagnosticResult} onChange={updateField} disabled={submitted} placeholder="Rangkum hasil penggalian kebutuhan, kesiapan, dan area yang perlu dikembangkan." />
                <div className="mo-form-grid two-columns">
                  <SelectField label="Kesiapan student" name="readiness" value={form.readiness} onChange={updateField} disabled={submitted} options={["Tinggi", "Sedang", "Perlu perhatian"]} />
                  <SelectField label="Prioritas follow-up" name="priority" value={form.priority} onChange={updateField} disabled={submitted} options={["Normal", "Prioritas tinggi", "Risiko"]} />
                </div>
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="05" icon={Send} title="Follow-up plan" description="Tentukan tindakan lanjutan setelah sesi onboarding." />
                <TextAreaField label="Rekomendasi next step *" name="recommendedNextSteps" value={form.recommendedNextSteps} onChange={updateField} disabled={submitted} placeholder="Contoh: MO menyusun diagnostic report, student melengkapi dokumen, lalu LP dibuat." />
                <Field label="Tanggal follow-up" name="followUpDate" type="date" value={form.followUpDate} onChange={updateField} disabled={submitted} />
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="06" icon={User} title="Catatan internal" description="Catatan tambahan untuk MO dan tim terkait." />
                <TextAreaField label="Catatan internal" name="internalNotes" value={form.internalNotes} onChange={updateField} disabled={submitted} placeholder="Tambahkan konteks yang tidak perlu disampaikan langsung kepada student." />
              </section>

              <footer className="mo-report-actions">
                <div className={`mo-save-message ${saveMessage.includes("berhasil") || saveMessage.includes("tersimpan") ? "success" : "error"}`} role="status">{saveMessage}</div>
                {!submitted && <><button type="button" className="mo-secondary-button" onClick={saveDraft}><Save size={16} /> Simpan draft</button><button type="submit" className="mo-primary-button"><Send size={16} /> Submit report</button></>}
                {submitted && <button type="button" className="mo-secondary-button" onClick={() => setSubmitted(false)}>Edit report</button>}
              </footer>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}

function ReferencePanel({ student }) {
  const { profile } = student;
  return (
    <aside className="mo-reference-panel">
      <div className="mo-reference-sticky">
        <div className="mo-reference-header"><span className="mo-reference-avatar">{getInitials(student.studentName)}</span><div><p className="mo-eyebrow">REFERENCE DATA</p><h2>{student.studentName}</h2><span>{student.studentId} · {student.packageName}</span></div></div>
        <div className="mo-reference-contact"><span>{student.email}</span><span>{student.phone}</span></div>
        <ReferenceSection title="Handover form">
          <ReferenceItem label="Payment date" value={student.paymentDate} />
          <ReferenceItem label="Diteruskan pada" value={student.submittedAt} />
          <ReferenceItem label="Diteruskan oleh" value={student.submittedBy} />
          <ReferenceItem label="Produk" value={student.packageName} />
          <ReferenceItem label="Pendidikan" value={student.currentEducation} />
          <ReferenceItem label="Target studi" value={`${student.targetDegree} · ${student.intendedMajor}`} />
          <ReferenceItem label="Intake" value={student.targetIntake} />
          <ReferenceItem label="Program" value={student.program} />
          <ReferenceItem label="Negara tujuan" value={student.targetCountries} />
          <ReferenceItem label="Universitas" value={student.targetUniversities} />
          <ReferenceItem label="Budget" value={student.budgetRange} />
          <ReferenceItem label="English level" value={student.englishLevel} />
          <ReferenceNote label="Tujuan student" value={student.studentGoals} />
          <ReferenceNote label="Catatan tambahan" value={student.additionalNotes} />
        </ReferenceSection>
        <ReferenceSection title="Profil SLMS">
          <ReferenceItem label="Email" value={profile?.email} />
          <ReferenceItem label="No. HP" value={profile?.phone} />
          <ReferenceItem label="Status profil" value={profile?.profileStatus === "complete" ? "Lengkap" : profile?.profileStatus} />
          <ReferenceItem label="Sinkronisasi" value={profile?.lastSyncedAt} />
          <ReferenceItem label="Domisili" value={profile?.city} />
          <ReferenceItem label="Tanggal lahir" value={profile?.dateOfBirth} />
          <ReferenceItem label="Pendidikan" value={profile?.currentEducation} />
          <ReferenceItem label="Jenjang tujuan" value={profile?.targetDegree} />
          <ReferenceItem label="Target intake" value={profile?.targetIntake} />
          <ReferenceItem label="Jurusan" value={profile?.intendedMajor} />
          <ReferenceItem label="Negara tujuan" value={profile?.targetCountries} />
          <ReferenceItem label="English level" value={profile?.englishLevel} />
          <ReferenceItem label="Minat" value={profile?.interests} />
          <ReferenceItem label="Kontak orang tua" value={profile?.parentContact} />
          <ReferenceNote label="Tujuan di SLMS" value={profile?.studentGoals} />
        </ReferenceSection>
        <div className="mo-reference-tip"><FileText size={15} /><span>Data ini bersifat read-only dan membantu MO mengisi report dengan konteks yang lengkap.</span></div>
      </div>
    </aside>
  );
}

function ReferenceSection({ title, children }) { return <section className="mo-reference-section"><h3>{title}</h3>{children}</section>; }
function ReferenceItem({ label, value }) { return <div className="mo-reference-item"><span>{label}</span><strong>{value || "—"}</strong></div>; }
function ReferenceNote({ label, value }) { return <div className="mo-reference-note"><span>{label}</span><p>{value || "—"}</p></div>; }

function FormSectionHeading({ number, icon: Icon, title, description }) {
  return <div className="mo-form-section-heading"><span className="mo-form-section-number">{number}</span><span className="mo-form-section-icon"><Icon size={17} /></span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function Field({ label, name, type = "text", value, onChange, disabled }) {
  return <label className="mo-field"><span>{label}</span><input name={name} type={type} value={value} onChange={onChange} disabled={disabled} /></label>;
}

function SelectField({ label, name, value, onChange, options, disabled }) {
  return <label className="mo-field"><span>{label}</span><select name={name} value={value} onChange={onChange} disabled={disabled}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function TextAreaField({ label, name, value, onChange, placeholder, disabled }) {
  return <label className="mo-field mo-field-full"><span>{label}</span><textarea name={name} rows={4} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} /></label>;
}

function getInitials(name) {
  if (!name) return "MO";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
