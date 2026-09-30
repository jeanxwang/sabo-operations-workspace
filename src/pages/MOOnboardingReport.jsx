import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, LogOut, Save, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import { mockMoHandoverForms } from "../data/mockMoHandoverForms";
import { mockMoStudentProfiles } from "../data/mockMoStudentProfiles";
import {
  DIAGNOSING_CONTEXT_OPTIONS,
  DIAGNOSING_CRITERIA,
  DIAGNOSING_SCORE_OPTIONS,
  LEARNING_PLAN_CATEGORIES,
  PROFILE_CONFIRMATION_FIELDS,
  PROFILE_CONFIRMATION_OPTIONS,
  getEmptyProfileConfirmation,
  getAssessmentProgress,
  getEmptyAssessmentScores,
  getReadinessGrade,
  getStudentGrade,
} from "../data/mockMoDiagnosingChecklist";
import "../pages/StudentBuddyDashboard.css";
import "./MOHandover.css";
import "./MOOnboardingReport.css";

const REPORT_DRAFT_PREFIX = "mo_onboarding_report_draft_";
const REPORT_SUBMITTED_PREFIX = "mo_onboarding_report_";

const INITIAL_REPORT = {
  profileConfirmation: getEmptyProfileConfirmation(),
  studentType: "Belum ditentukan",
  isDemanding: "Belum ditentukan",
  isVeteran: "Belum ditentukan",
  isStubborn: "Belum ditentukan",
  researchProposalRequired: "Tidak",
  assessmentScores: getEmptyAssessmentScores(),
  assessmentRecommendations: {},
  learningPlanFocus: [],
};

function findStudent(studentId) {
  const handover = mockMoHandoverForms.find((record) => record.studentId === studentId);
  const profile = mockMoStudentProfiles.find((record) => record.id === studentId);
  if (!handover) return null;
  return { ...handover, profile };
}

function getInitialReport() {
  return {
    ...INITIAL_REPORT,
    profileConfirmation: { ...INITIAL_REPORT.profileConfirmation },
    assessmentScores: { ...INITIAL_REPORT.assessmentScores },
  };
}

function normalizeReportForm(rawForm) {
  const form = rawForm && typeof rawForm === "object" ? rawForm : {};
  return {
    profileConfirmation: {
      ...getEmptyProfileConfirmation(),
      ...(form.profileConfirmation && typeof form.profileConfirmation === "object" ? form.profileConfirmation : {}),
    },
    studentType: form.studentType || INITIAL_REPORT.studentType,
    isDemanding: form.isDemanding || INITIAL_REPORT.isDemanding,
    isVeteran: form.isVeteran || INITIAL_REPORT.isVeteran,
    isStubborn: form.isStubborn || INITIAL_REPORT.isStubborn,
    researchProposalRequired: form.researchProposalRequired || INITIAL_REPORT.researchProposalRequired,
    assessmentScores: {
      ...getEmptyAssessmentScores(),
      ...(form.assessmentScores && typeof form.assessmentScores === "object" ? form.assessmentScores : {}),
    },
    assessmentRecommendations: {
      ...(form.assessmentRecommendations && typeof form.assessmentRecommendations === "object" ? form.assessmentRecommendations : {}),
    },
    learningPlanFocus: Array.isArray(form.learningPlanFocus) ? form.learningPlanFocus : [],
  };
}

function parseCurrentReport(serialized) {
  if (!serialized) return null;

  try {
    const parsed = JSON.parse(serialized);
    if (
      !parsed.form
      || typeof parsed.form !== "object"
      || !parsed.form.assessmentScores
      || !parsed.form.profileConfirmation
      || typeof parsed.form.profileConfirmation !== "object"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function MOOnboardingReport({ user, onLogout }) {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const student = useMemo(() => findStudent(studentId), [studentId]);
  const [form, setForm] = useState(getInitialReport);
  const [saveMessage, setSaveMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const learningPlanFocus = Array.isArray(form.learningPlanFocus) ? form.learningPlanFocus : [];
  const assessmentProgress = getAssessmentProgress(form.assessmentScores, form.researchProposalRequired);
  const studentGrade = getStudentGrade(assessmentProgress.coreScore);
  const readinessGrade = getReadinessGrade(assessmentProgress.readinessScore, form.researchProposalRequired === "Ya");

  useEffect(() => {
    if (!student) return;
    const savedReport = parseCurrentReport(localStorage.getItem(`${REPORT_SUBMITTED_PREFIX}${student.studentId}`));
    const savedDraft = parseCurrentReport(localStorage.getItem(`${REPORT_DRAFT_PREFIX}${student.studentId}`));
    const savedData = savedReport || savedDraft;

    if (savedData) {
      setForm(normalizeReportForm(savedData.form));
      setSubmitted(Boolean(savedData.status === "submitted"));
    } else {
      setForm(getInitialReport());
      setSubmitted(false);
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

  function updateAssessmentScore(criterionId, value) {
    setForm((current) => ({
      ...current,
      assessmentScores: {
        ...current.assessmentScores,
        [criterionId]: value === "" ? null : Number(value),
      },
    }));
    setSaveMessage("");
  }

  function updateAssessmentRecommendation(criterionId, value) {
    setForm((current) => ({
      ...current,
      assessmentRecommendations: { ...current.assessmentRecommendations, [criterionId]: value },
    }));
    setSaveMessage("");
  }

  function updateProfileConfirmation(fieldId, value) {
    setForm((current) => ({
      ...current,
      profileConfirmation: {
        ...current.profileConfirmation,
        [fieldId]: value,
      },
    }));
    setSaveMessage("");
  }

  function toggleLearningPlanFocus(categoryId) {
    setForm((current) => {
      const selected = Array.isArray(current.learningPlanFocus) ? current.learningPlanFocus : [];
      const next = selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId];

      return { ...current, learningPlanFocus: next };
    });
    setSaveMessage("");
  }

  function saveDraft() {
    localStorage.setItem(`${REPORT_DRAFT_PREFIX}${student.studentId}`, JSON.stringify({ status: "draft", form, updatedAt: new Date().toISOString() }));
    localStorage.removeItem(`${REPORT_SUBMITTED_PREFIX}${student.studentId}`);
    setSaveMessage("Draft tersimpan. Anda masih dapat melanjutkan pengisian.");
  }

  function submitReport(event) {
    event.preventDefault();
    const assessmentProgress = getAssessmentProgress(form.assessmentScores, form.researchProposalRequired);
    const assessmentsComplete = assessmentProgress.completed === assessmentProgress.total;
    const profile = form.profileConfirmation || {};
    const requiredProfileFields = [
      "studentName",
      "packageName",
      "birthdate",
      "gender",
      "degreeProgram",
      "currentBackground",
      "currentInstitution",
      "intake",
      "careerPlan",
      "majorGoalsDream",
      "countryGoalsDream",
      "languageTest",
      "scholarshipGoals",
      "universityGoals",
      "fundingPreference",
      "schedulePreference",
    ];
    const missingProfileFields = requiredProfileFields.filter((fieldId) => !String(profile[fieldId] || "").trim());
    if (missingProfileFields.length) {
      setSaveMessage("Lengkapi field utama Profile confirmation sebelum submit report.");
      return;
    }
    const applicableCriteria = DIAGNOSING_CRITERIA.filter((criterion) => !criterion.optional || criterion.id !== "research-proposal-quality" || form.researchProposalRequired === "Ya");
    const missingRecommendations = applicableCriteria.some((criterion) => !String(form.assessmentRecommendations?.[criterion.id] || "").trim());
    if (missingRecommendations) {
      setSaveMessage("Isi recommendation / student's to-do untuk setiap kriteria diagnosing yang relevan.");
      return;
    }
    if (!assessmentsComplete) {
      setSaveMessage("Lengkapi seluruh skor diagnosing yang relevan sebelum submit report.");
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
            <div><p className="mo-eyebrow">ONBOARDING REPORT · {student.studentId}</p><h1>Catat hasil onboarding student</h1><p>Lengkapi profile confirmation, diagnosing checklist, recommendation, dan learning plan mapping dari sesi onboarding.</p></div>
            <div className={`mo-report-state ${submitted ? "submitted" : ""}`}>{submitted ? <CheckCircle2 size={16} /> : <FileText size={16} />} {submitted ? "Report sudah disubmit" : "Belum disubmit"}</div>
          </div>

          <div className="mo-report-layout">
            <ReferencePanel student={student} />
            <form className="mo-report-form" onSubmit={submitReport}>
              <ProfileConfirmationSection
                form={form}
                student={student}
                disabled={submitted}
                onChange={updateProfileConfirmation}
              />

              <section className="mo-form-section">
                <FormSectionHeading number="02" icon={FileText} title="Diagnosing checklist" description="Isi konteks student, skor 0–4, dan recommendation/student's to-do sesuai hasil sesi onboarding." />
                <div className="mo-diagnosing-context-grid">
                  <DiagnosticSummary label="Student grade" value={studentGrade} detail={assessmentProgress.coreScore === null ? `${assessmentProgress.coreCompleted}/${assessmentProgress.coreTotal} skor grade terisi` : `Total skor ${assessmentProgress.coreScore}/24`} tone="blue" />
                  <DiagnosticSummary label="Student readiness" value={readinessGrade} detail={`${assessmentProgress.readinessCompleted}/${assessmentProgress.readinessTotal} skor readiness terisi`} tone="purple" />
                </div>
                <div className="mo-score-legend"><strong>Panduan skor</strong>{DIAGNOSING_SCORE_OPTIONS.map((option) => <span key={option.value}><b>{option.value}</b>{option.label.split(" · ")[1]}</span>)}</div>
                <div className="mo-form-grid two-columns mo-diagnosing-context-fields">
                  <SelectField label="Research proposal required" name="researchProposalRequired" value={form.researchProposalRequired} onChange={updateField} disabled={submitted} options={DIAGNOSING_CONTEXT_OPTIONS.researchProposal} />
                  <SelectField label="Tipe student" name="studentType" value={form.studentType} onChange={updateField} disabled={submitted} options={DIAGNOSING_CONTEXT_OPTIONS.studentType} />
                  <SelectField label="Termasuk student demanding?" name="isDemanding" value={form.isDemanding} onChange={updateField} disabled={submitted} options={DIAGNOSING_CONTEXT_OPTIONS.yesNo} />
                  <SelectField label="Student veteran study abroad?" name="isVeteran" value={form.isVeteran} onChange={updateField} disabled={submitted} options={DIAGNOSING_CONTEXT_OPTIONS.yesNo} />
                  <SelectField label="Student ngotot pada pilihan tertentu?" name="isStubborn" value={form.isStubborn} onChange={updateField} disabled={submitted} options={DIAGNOSING_CONTEXT_OPTIONS.yesNo} />
                </div>
                <div className="mo-assessment-list">
                  {DIAGNOSING_CRITERIA.map((criterion) => (
                    <AssessmentCriterionCard
                      key={criterion.id}
                      criterion={criterion}
                      score={form.assessmentScores[criterion.id]}
                      recommendation={form.assessmentRecommendations[criterion.id] || ""}
                      disabled={submitted || (criterion.id === "research-proposal-quality" && form.researchProposalRequired !== "Ya")}
                      onScoreChange={updateAssessmentScore}
                      onRecommendationChange={updateAssessmentRecommendation}
                    />
                  ))}
                </div>
              </section>

              <section className="mo-form-section">
                <FormSectionHeading number="03" icon={ClipboardCheck} title="Learning plan mapping" description="Pilih area syllabus yang perlu masuk ke learning plan berdasarkan hasil diagnosing." />
                <div className="mo-learning-plan-list">
                  {LEARNING_PLAN_CATEGORIES.map((category) => {
                    const selected = learningPlanFocus.includes(category.id);

                    return <label
                      className={`mo-learning-plan-item ${selected ? "selected" : ""}`}
                      key={category.id}
                      onClick={(event) => {
                        if (event.target?.type === "checkbox") return;
                        event.preventDefault();
                        toggleLearningPlanFocus(category.id);
                      }}
                    >
                      <input
                        className="mo-learning-plan-input"
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleLearningPlanFocus(category.id)}
                        disabled={submitted}
                      />
                      <span>
                        <strong>{category.label}</strong>
                        <small>{category.topics}</small>
                      </span>
                    </label>;
                  })}
                </div>
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
        <div className="mo-reference-tip"><FileText size={15} /><span>Handover dan profil SLMS bersifat read-only. Profile confirmation diisi MO pada form report di sebelah kanan.</span></div>
      </div>
    </aside>
  );
}

function ReferenceSection({ title, children }) { return <section className="mo-reference-section"><h3>{title}</h3>{children}</section>; }
function ReferenceItem({ label, value }) { return <div className="mo-reference-item"><span>{label}</span><strong>{value || "—"}</strong></div>; }
function ReferenceNote({ label, value }) { return <div className="mo-reference-note"><span>{label}</span><p>{value || "—"}</p></div>; }

function ProfileConfirmationSection({ form, student, disabled, onChange }) {
  const groups = PROFILE_CONFIRMATION_FIELDS.reduce((result, field) => {
    if (!result[field.group]) result[field.group] = [];
    result[field.group].push(field);
    return result;
  }, {});

  const targetDegree = form.profileConfirmation?.degreeProgram || student?.targetDegree || "";
  const isGraduate = /S[23]/i.test(targetDegree);
  const visibleGroups = Object.entries(groups).map(([group, fields]) => [group, fields.filter((field) => !field.appliesTo || (field.appliesTo === "graduate" ? isGraduate : !isGraduate))]).filter(([, fields]) => fields.length);

  return (
    <section className="mo-form-section mo-profile-confirmation-section">
      <FormSectionHeading number="01" icon={FileText} title="Profile confirmation" description="Konfirmasi dan lengkapi informasi student selama sesi onboarding. Field ini diisi oleh MO, bukan dianggap sudah lengkap dari data handover atau SLMS." />
      <div className="mo-profile-confirmation-note"><FileText size={15} /><span>Gunakan handover dan profil SLMS di panel kiri sebagai referensi. Catat jawaban aktual student pada sesi ini.</span></div>
      <div className="mo-profile-groups">
        {visibleGroups.map(([group, fields]) => (
          <section className="mo-profile-group" key={group}>
            <h3>{group}</h3>
            <div className="mo-form-grid two-columns">
              {fields.map((field) => (
                <ProfileConfirmationField key={field.id} field={field} value={form.profileConfirmation?.[field.id] || ""} disabled={disabled} onChange={onChange} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ProfileConfirmationField({ field, value, disabled, onChange }) {
  const className = field.type === "textarea" ? "mo-field mo-profile-field mo-profile-field-wide" : "mo-field mo-profile-field";
  if (field.type === "select") {
    const options = PROFILE_CONFIRMATION_OPTIONS[field.options] || [];
    return <label className={className}><span>{field.label}</span><select value={value} onChange={(event) => onChange(field.id, event.target.value)} disabled={disabled}>{options.map((option) => <option key={option} value={option}>{option || "Pilih jawaban"}</option>)}</select></label>;
  }
  if (field.type === "textarea") {
    return <label className={className}><span>{field.label}</span><textarea rows={3} value={value} onChange={(event) => onChange(field.id, event.target.value)} disabled={disabled} placeholder={field.placeholder} /></label>;
  }
  return <label className={className}><span>{field.label}</span><input type="text" value={value} onChange={(event) => onChange(field.id, event.target.value)} disabled={disabled} placeholder={field.placeholder} /></label>;
}

function FormSectionHeading({ number, icon: Icon, title, description }) {
  return <div className="mo-form-section-heading"><span className="mo-form-section-number">{number}</span><span className="mo-form-section-icon"><Icon size={17} /></span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function SelectField({ label, name, value, onChange, options, disabled }) {
  return <label className="mo-field"><span>{label}</span><select name={name} value={value} onChange={onChange} disabled={disabled}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function DiagnosticSummary({ label, value, detail, tone }) {
  return <div className={`mo-diagnostic-summary tone-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function AssessmentCriterionCard({ criterion, score, recommendation, disabled, onScoreChange, onRecommendationChange }) {
  return (
    <article className={`mo-assessment-card ${disabled ? "disabled" : ""}`}>
      <div className="mo-assessment-card-header">
        <div><span className="mo-assessment-category">{criterion.category}{criterion.optional ? " · opsional" : ""}</span><h3>{criterion.label}</h3><p>{criterion.helper}</p></div>
        <label className="mo-score-field"><span>Skor</span><select value={score ?? ""} onChange={(event) => onScoreChange(criterion.id, event.target.value)} disabled={disabled}><option value="">Pilih</option>{DIAGNOSING_SCORE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.value}</option>)}</select></label>
      </div>
      <div className="mo-assessment-card-body"><label className="mo-field"><span>Rekomendasi / student&apos;s to-do</span><small className="mo-recommendation-guide">Panduan: {criterion.recommendation}</small><textarea rows={3} value={recommendation} onChange={(event) => onRecommendationChange(criterion.id, event.target.value)} disabled={disabled} placeholder="Tuliskan recommendation atau action item hasil sesi." /></label></div>
    </article>
  );
}

function getInitials(name) {
  if (!name) return "MO";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
