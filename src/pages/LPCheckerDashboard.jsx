import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileText,
  Globe2,
  Pencil,
  Plus,
  Save,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import AcademicSidebar from "../components/AcademicSidebar";
import TopbarActions from "../components/TopbarActions";
import { mockMoHandoverForms } from "../data/mockMoHandoverForms";
import { mockMoStudentProfiles } from "../data/mockMoStudentProfiles";
import {
  DIAGNOSING_CRITERIA,
  LEARNING_PLAN_CATEGORIES,
  PROFILE_CONFIRMATION_FIELDS,
} from "../data/mockMoDiagnosingChecklist";
import { LP_STATUS, mockLpCreations } from "../data/mockLpCreations";
import {
  LP_RECOMMENDATION_STATUS,
  mockLpScholarshipRecommendations,
  mockLpUniversityRecommendations,
} from "../data/mockLpRecommendations";
import "../pages/StudentBuddyDashboard.css";
import "./LPCheckerDashboard.css";

export default function LPCheckerDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const { lpId, lpTab = "diagnosing" } = useParams();
  const activeReviewTab = ["diagnosing", "scholarships", "universities"].includes(lpTab) ? lpTab : "diagnosing";
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lps, setLps] = useState(mockLpCreations);
  const [scholarshipRecommendations, setScholarshipRecommendations] = useState(mockLpScholarshipRecommendations);
  const [universityRecommendations, setUniversityRecommendations] = useState(mockLpUniversityRecommendations);

  const counts = useMemo(
    () => ({
      all: lps.length,
      review: lps.filter((lp) => lp.status === "review").length,
      checked: lps.filter((lp) => lp.status === "checked").length,
      released: lps.filter((lp) => lp.status === "released").length,
    }),
    [lps]
  );

  const filteredLps = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return lps.filter((lp) => {
      const matchesSearch =
        !keyword ||
        [lp.studentName, lp.studentId, lp.id, lp.targetMajor, lp.program, lp.createdBy]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesStatus = statusFilter === "all" || lp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [lps, searchKeyword, statusFilter]);

  function handleUpdateLp(updatedLp) {
    setLps((currentLps) => currentLps.map((lp) => (lp.id === updatedLp.id ? updatedLp : lp)));
  }

  function handleAddRecommendation(type, recommendation) {
    const setRecommendations = type === "universities" ? setUniversityRecommendations : setScholarshipRecommendations;
    setRecommendations((currentRecommendations) => [...currentRecommendations, recommendation]);
  }

  function handleUpdateRecommendation(type, updatedRecommendation) {
    const setRecommendations = type === "universities" ? setUniversityRecommendations : setScholarshipRecommendations;
    setRecommendations((currentRecommendations) => currentRecommendations.map((recommendation) => (
      recommendation.id === updatedRecommendation.id ? updatedRecommendation : recommendation
    )));
  }

  function handleDeleteRecommendation(type, recommendationId) {
    const setRecommendations = type === "universities" ? setUniversityRecommendations : setScholarshipRecommendations;
    setRecommendations((currentRecommendations) => currentRecommendations.filter((recommendation) => recommendation.id !== recommendationId));
  }

  function handleRecommendationStatus(type, recommendationId, status) {
    const setRecommendations = type === "universities" ? setUniversityRecommendations : setScholarshipRecommendations;
    setRecommendations((currentRecommendations) => currentRecommendations.map((recommendation) => (
      recommendation.id === recommendationId
        ? { ...recommendation, status, sourceCheckedAt: status === "validated" ? formatUpdatedAt() : recommendation.sourceCheckedAt }
        : recommendation
    )));
  }

  if (lpId) {
    const selectedLp = lps.find((lp) => lp.id === lpId);

    if (!selectedLp) {
      return <NotFoundReviewPage user={user} onLogout={onLogout} onBack={() => navigate("/lp-checker/learning-plans")} />;
    }

    return (
      <LPReviewPage
        user={user}
        onLogout={onLogout}
        lp={selectedLp}
        activeTab={activeReviewTab}
        onBack={() => navigate("/lp-checker/learning-plans")}
        onUpdate={handleUpdateLp}
        scholarshipRecommendations={scholarshipRecommendations}
        universityRecommendations={universityRecommendations}
        onAddRecommendation={handleAddRecommendation}
        onUpdateRecommendation={handleUpdateRecommendation}
        onDeleteRecommendation={handleDeleteRecommendation}
        onRecommendationStatusChange={handleRecommendationStatus}
      />
    );
  }

  return (
    <main className="dashboard-page lp-page">
      <AcademicSidebar user={user} onLogout={onLogout} mode="lp-checker" />

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>LP Checker</span>
            <span className="breadcrumb-separator">›</span>
            <strong>LP Creation</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="lp-content">
          <div className="lp-page-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="lp-eyebrow">LEARNING PLAN</p>
              <h1>LP Creation</h1>
              <p>Lihat learning plan student yang dibuat setelah sesi onboarding dan diagnosing checklist.</p>
            </div>
            <div className="lp-read-only-note"><ShieldCheck size={16} /> Review & validasi</div>
          </div>

          <section className="lp-summary-grid" aria-label="Ringkasan learning plan">
            <SummaryCard label="Total LP" value={counts.all} icon={Users} tone="blue" />
            <SummaryCard label="Menunggu validasi" value={counts.review} icon={FileText} tone="orange" />
            <SummaryCard label="Sudah divalidasi" value={counts.checked} icon={ClipboardCheck} tone="purple" />
            <SummaryCard label="Sudah dirilis" value={counts.released} icon={CheckCircle2} tone="green" />
          </section>

          <section className="lp-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="lp-card-header">
              <div>
                <h2>Learning plan student</h2>
                <p>Daftar LP yang dibuat oleh LP Maker berdasarkan hasil onboarding dan diagnosing student.</p>
              </div>
              <span>{filteredLps.length} LP ditampilkan</span>
            </header>

            <div className="lp-toolbar">
              <label className="lp-search">
                <Search size={18} />
                <input aria-label="Cari learning plan" type="search" placeholder="Cari student, ID LP, program, atau jurusan..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} />
              </label>
              <div className="lp-filter-tabs" role="group" aria-label="Filter status LP">
                <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label="Semua" count={counts.all} />
                <FilterButton active={statusFilter === "review"} onClick={() => setStatusFilter("review")} label="Menunggu validasi" count={counts.review} />
                <FilterButton active={statusFilter === "checked"} onClick={() => setStatusFilter("checked")} label="Sudah divalidasi" count={counts.checked} />
                <FilterButton active={statusFilter === "released"} onClick={() => setStatusFilter("released")} label="Dirilis" count={counts.released} />
              </div>
            </div>

            <div className="lp-table-wrapper">
              <table className="lp-table" id="lp-table">
                <caption className="sr-only">Daftar learning plan student</caption>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Target studi</th>
                    <th>Dibuat oleh</th>
                    <th>Dibuat pada</th>
                    <th>Status LP</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {filteredLps.map((lp) => (
                    <tr key={lp.id}>
                      <td><strong>{lp.studentName}</strong><span>{lp.studentId} · {lp.id}</span></td>
                      <td><strong>{lp.targetDegree} · {lp.targetMajor}</strong><span>{lp.targetCountries} · {lp.targetIntake}</span></td>
                      <td><strong>{lp.createdBy.split(" · ")[0]}</strong><span>{lp.createdBy.split(" · ")[1]}</span></td>
                      <td className="lp-muted-cell">{lp.createdAt}</td>
                      <td><LpStatus status={lp.status} /></td>
                      <td><button type="button" className="lp-detail-button" aria-label={`Review LP ${lp.id}`} onClick={() => navigate(`/lp-checker/learning-plans/${lp.id}`)}>Review LP</button></td>
                    </tr>
                  ))}
                  {filteredLps.length === 0 && <tr className="lp-empty-row"><td colSpan={6}>Tidak ada LP yang sesuai.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function LPReviewPage({ user, onLogout, lp, activeTab, onBack, onUpdate, scholarshipRecommendations, universityRecommendations, onAddRecommendation, onUpdateRecommendation, onDeleteRecommendation, onRecommendationStatusChange }) {
  return (
    <main className="dashboard-page lp-page">
      <AcademicSidebar user={user} onLogout={onLogout} mode="lp-checker" />
      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span><span className="breadcrumb-separator">›</span><span>LP Checker</span><span className="breadcrumb-separator">›</span><strong>Review LP</strong>
          </div>
          <TopbarActions />
        </header>
        <section className="lp-content lp-review-content">
          <button type="button" className="lp-back-link" onClick={onBack}>← Kembali ke daftar LP</button>
          <LpDetailDrawer
            lp={lp}
            activeTab={activeTab}
            onClose={onBack}
            onUpdate={onUpdate}
            fullPage
            scholarshipRecommendations={scholarshipRecommendations}
            universityRecommendations={universityRecommendations}
            onAddRecommendation={onAddRecommendation}
            onUpdateRecommendation={onUpdateRecommendation}
            onDeleteRecommendation={onDeleteRecommendation}
            onRecommendationStatusChange={onRecommendationStatusChange}
          />
        </section>
      </section>
    </main>
  );
}

function NotFoundReviewPage({ user, onLogout, onBack }) {
  return (
    <main className="dashboard-page lp-page">
      <AcademicSidebar user={user} onLogout={onLogout} mode="lp-checker" />
      <section className="dashboard-main"><header className="topbar"><div className="breadcrumbs"><span>SABO Operations</span><span className="breadcrumb-separator">›</span><strong>LP Checker</strong></div><TopbarActions /></header><section className="lp-content"><div className="lp-card lp-not-found"><h1>Learning plan tidak ditemukan</h1><p>LP yang ingin dibuka tidak tersedia.</p><button type="button" className="lp-primary-action" onClick={onBack}>Kembali ke daftar LP</button></div></section></section>
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return <article className={`lp-summary-card tone-${tone}`}><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function RecommendationStatus({ status }) {
  const config = LP_RECOMMENDATION_STATUS[status];
  return <span className={`lp-status ${config.tone}`}><span />{config.label}</span>;
}

function FilterButton({ active, onClick, label, count }) {
  return <button type="button" className={active ? "active" : ""} aria-pressed={active} onClick={onClick}>{label}<span>{count}</span></button>;
}

function LpStatus({ status }) {
  const config = LP_STATUS[status];
  return <span className={`lp-status ${config.tone}`}><span />{config.label}</span>;
}

function LpDetailDrawer({ lp, activeTab = "diagnosing", onClose, onUpdate, fullPage = false, scholarshipRecommendations, universityRecommendations, onAddRecommendation, onUpdateRecommendation, onDeleteRecommendation, onRecommendationStatusChange }) {
  const [objective, setObjective] = useState(lp.objective);
  const [focusAreas, setFocusAreas] = useState(lp.focusAreas.join("\n"));
  const [milestones, setMilestones] = useState(lp.milestones.join("\n"));
  const [notes, setNotes] = useState(lp.notes);
  const [checks, setChecks] = useState(() => getInitialValidationChecks(lp));
  const [saveMessage, setSaveMessage] = useState("");
  const [activeSource, setActiveSource] = useState(null);
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const externalReferences = getExternalReferenceLinks(lp);
  const internalSources = getInternalSourcePreviews(lp);
  const allChecksComplete = Object.values(checks).every(Boolean);
  const lpRecommendations = [...(scholarshipRecommendations ?? []), ...(universityRecommendations ?? [])].filter((recommendation) => recommendation.lpId === lp.id);
  const allRecommendationsValidated = lpRecommendations.every((recommendation) => recommendation.status === "validated");
  const canRelease = lp.status === "checked" && allChecksComplete && allRecommendationsValidated;

  function updateCheck(id) {
    setChecks((currentChecks) => ({ ...currentChecks, [id]: !currentChecks[id] }));
    setSaveMessage("");
  }

  function saveChanges({ validate = false, release = false } = {}) {
    const parsedFocusAreas = parseLines(focusAreas);
    const parsedMilestones = parseLines(milestones);

    if (!objective.trim() || parsedFocusAreas.length === 0 || parsedMilestones.length === 0) {
      setSaveMessage("Tujuan utama, focus area, dan milestone wajib diisi.");
      return;
    }

    if ((validate || release) && !allChecksComplete) {
      setSaveMessage("Centang seluruh checklist validasi sebelum menandai LP sudah divalidasi.");
      return;
    }

    if ((validate || release) && !allRecommendationsValidated) {
      setSaveMessage("Validasi semua rekomendasi beasiswa dan universitas terlebih dahulu.");
      return;
    }

    if (release && lp.status !== "checked") {
      setSaveMessage("Validasi LP terlebih dahulu sebelum merilisnya.");
      return;
    }

    if (release && !window.confirm(`Rilis learning plan ${lp.id} untuk ${lp.studentName}?`)) {
      return;
    }

    const updatedLp = {
      ...lp,
      objective: objective.trim(),
      focusAreas: parsedFocusAreas,
      milestones: parsedMilestones,
      notes: notes.trim(),
      status: release ? "released" : validate ? (lp.status === "released" ? "released" : "checked") : "review",
      updatedAt: formatUpdatedAt(),
    };

    onUpdate(updatedLp);
    if (!validate && !release) {
      setChecks({ student: false, target: false, external: false });
    }
    setSaveMessage(release ? "LP berhasil dirilis dan siap diteruskan ke student serta tim terkait." : validate ? "LP berhasil ditandai sudah divalidasi." : "Revisi LP tersimpan dan menunggu validasi ulang.");
  }

  const reviewShellClass = fullPage ? "lp-review-document" : "lp-drawer-backdrop";
  const reviewContentClass = fullPage ? "lp-review-document-content" : "lp-drawer";

  return (
    <div className={reviewShellClass} role={fullPage ? undefined : "presentation"} onMouseDown={fullPage ? undefined : onClose}>
      <aside className={reviewContentClass} role={fullPage ? undefined : "dialog"} aria-modal={fullPage ? undefined : "true"} aria-labelledby="lp-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="lp-drawer-header">
          <div><span className="lp-drawer-eyebrow">LEARNING PLAN · {lp.id}</span><h2 id="lp-detail-title">{lp.studentName}</h2><p>{lp.studentId} · Dibuat {lp.createdAt}</p></div>
          {!fullPage && <button type="button" className="lp-close-button" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button>}
        </header>

        <div className="lp-drawer-status"><LpStatus status={lp.status} /><span>Review workspace</span></div>

        <div className="lp-review-callout">
          <ShieldCheck size={18} />
          <div><strong>Validasi sebelum LP diteruskan</strong><p>Bandingkan isi LP dengan data student, hasil diagnosing checklist, serta sumber resmi universitas dan beasiswa.</p></div>
        </div>

        <ReviewTabNavigation lpId={lp.id} activeTab={activeTab} />

        {activeTab === "diagnosing" && <>
        <DetailSection title="Informasi student">
          <DetailItem label="Email" value={lp.email} />
          <DetailItem label="No. HP" value={lp.phone} />
          <DetailItem label="Program" value={lp.program} />
          <DetailItem label="Dibuat oleh" value={lp.createdBy} />
          <DetailItem label="Update terakhir" value={lp.updatedAt} />
        </DetailSection>

        <DetailSection title="Sumber data validasi">
          <div className="lp-source-group">
            <div className="lp-source-heading"><Database size={15} /><strong>Data internal SABO</strong></div>
            <p>Gunakan data handover, profil SLMS, dan hasil diagnosing checklist sebagai sumber utama.</p>
            <div className="lp-source-tags">
              {internalSources.map((source) => (
                <button key={source.id} type="button" className={activeSource === source.id ? "active" : ""} aria-pressed={activeSource === source.id} onClick={() => setActiveSource(source.id)}>{source.label}</button>
              ))}
            </div>
            {activeSource && <SourcePreview source={internalSources.find((source) => source.id === activeSource)} onClose={() => setActiveSource(null)} />}
          </div>
          <div className="lp-source-group">
            <div className="lp-source-heading"><Globe2 size={15} /><strong>Referensi eksternal</strong></div>
            <p>Pastikan target studi, requirement, dan rekomendasi beasiswa masih sesuai dengan sumber resmi.</p>
            <div className="lp-reference-list">
              {externalReferences.map((reference) => (
                <a key={reference.label} href={reference.href} target="_blank" rel="noreferrer" className="lp-reference-link">
                  <span><strong>{reference.label}</strong><small>{reference.description}</small></span><ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Target studi">
          <DetailItem label="Jenjang" value={lp.targetDegree} />
          <DetailItem label="Jurusan" value={lp.targetMajor} />
          <DetailItem label="Negara tujuan" value={lp.targetCountries} />
          <DetailItem label="Target intake" value={lp.targetIntake} />
        </DetailSection>
        <DetailSection title="Isi learning plan">
          <label className="lp-edit-field"><span>Tujuan utama</span><textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows={3} /></label>
          <label className="lp-edit-field"><span>Focus area <small>(satu item per baris)</small></span><textarea value={focusAreas} onChange={(event) => setFocusAreas(event.target.value)} rows={4} /></label>
          <label className="lp-edit-field"><span>Milestone awal <small>(satu item per baris)</small></span><textarea value={milestones} onChange={(event) => setMilestones(event.target.value)} rows={4} /></label>
          <label className="lp-edit-field"><span>Catatan onboarding</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} /></label>
        </DetailSection>
        </>}

        {activeTab === "scholarships" && <RecommendationReviewSection lpId={lp.id} studentId={lp.studentId} studentName={lp.studentName} type="scholarships" recommendations={scholarshipRecommendations} onAdd={onAddRecommendation} onUpdate={onUpdateRecommendation} onDelete={onDeleteRecommendation} onStatusChange={onRecommendationStatusChange} onMessage={setRecommendationMessage} />}
        {activeTab === "universities" && <RecommendationReviewSection lpId={lp.id} studentId={lp.studentId} studentName={lp.studentName} type="universities" recommendations={universityRecommendations} onAdd={onAddRecommendation} onUpdate={onUpdateRecommendation} onDelete={onDeleteRecommendation} onStatusChange={onRecommendationStatusChange} onMessage={setRecommendationMessage} />}

        {recommendationMessage && <p className="lp-save-message" role="status">{recommendationMessage}</p>}

        <DetailSection title="Checklist validasi">
          <ValidationCheck checked={checks.student} onChange={() => updateCheck("student")} label="Data student sesuai" detail="Handover, profil SLMS, dan diagnosing checklist sudah dicocokkan." />
          <ValidationCheck checked={checks.target} onChange={() => updateCheck("target")} label="Target studi sesuai" detail="Jenjang, jurusan, negara tujuan, dan intake sudah relevan." />
          <ValidationCheck checked={checks.external} onChange={() => updateCheck("external")} label="Referensi eksternal terverifikasi" detail="Requirement universitas/program dan rekomendasi beasiswa mengacu pada sumber resmi." />
        </DetailSection>

        <div className="lp-drawer-actions">
          {saveMessage && <p className="lp-save-message" role="status">{saveMessage}</p>}
          <div className="lp-action-buttons">
            <button type="button" className="lp-secondary-action" onClick={() => saveChanges()}><Save size={15} /> Simpan revisi</button>
            <button type="button" className="lp-primary-action" disabled={!allChecksComplete || !allRecommendationsValidated || lp.status !== "review"} onClick={() => saveChanges({ validate: true })}><ShieldCheck size={15} /> {lp.status === "review" ? "Tandai sudah divalidasi" : "Sudah divalidasi"}</button>
            <button type="button" className="lp-primary-action lp-release-action" disabled={!canRelease} title={!allRecommendationsValidated ? "Validasi semua rekomendasi terlebih dahulu" : lp.status === "review" ? "Validasi LP terlebih dahulu" : lp.status === "released" ? "LP sudah dirilis" : "Rilis learning plan"} onClick={() => saveChanges({ release: true })}><Send size={15} /> {lp.status === "released" ? "LP sudah dirilis" : "Rilis LP"}</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ReviewTabNavigation({ lpId, activeTab }) {
  const tabs = [
    { id: "diagnosing", label: "Hasil Diagnosing" },
    { id: "scholarships", label: "Rekomendasi Beasiswa" },
    { id: "universities", label: "Rekomendasi Universitas" },
  ];

  return (
    <nav className="lp-review-tabs" aria-label="Review learning plan">
      {tabs.map((tab) => <NavLink key={tab.id} to={`/lp-checker/learning-plans/${lpId}/${tab.id}`} className={({ isActive }) => `lp-review-tab ${isActive || activeTab === tab.id ? "active" : ""}`} role="tab" aria-selected={activeTab === tab.id}>{tab.label}</NavLink>)}
    </nav>
  );
}

function RecommendationReviewSection({ lpId, studentId, studentName, type, recommendations, onAdd, onUpdate, onDelete, onStatusChange, onMessage }) {
  const rows = recommendations.filter((recommendation) => recommendation.lpId === lpId);
  const isUniversity = type === "universities";
  const [formMode, setFormMode] = useState(null);
  const [editingRecommendation, setEditingRecommendation] = useState(null);

  function openAddForm() {
    setEditingRecommendation(null);
    setFormMode("add");
  }

  function openEditForm(recommendation) {
    setEditingRecommendation(recommendation);
    setFormMode("edit");
  }

  function closeForm() {
    setEditingRecommendation(null);
    setFormMode(null);
  }

  function handleFormSubmit(formValues) {
    if (formMode === "edit") {
      onUpdate(type, { ...editingRecommendation, ...formValues, status: "review", sourceCheckedAt: "" });
      onMessage("Perubahan rekomendasi tersimpan dan statusnya dikembalikan ke menunggu validasi.");
    } else {
      const prefix = isUniversity ? "UNI" : "SCH";
      onAdd(type, {
        ...formValues,
        id: `${prefix}-${Date.now()}`,
        lpId,
        studentId: studentId ?? rows[0]?.studentId ?? "",
        studentName: studentName ?? rows[0]?.studentName ?? "",
        status: "review",
      });
      onMessage("Rekomendasi baru ditambahkan dan menunggu validasi.");
    }
    closeForm();
  }

  function handleDelete(recommendation) {
    if (!window.confirm(`Hapus rekomendasi ${isUniversity ? recommendation.university : recommendation.name}?`)) return;
    onDelete(type, recommendation.id);
    onMessage("Rekomendasi dihapus dari learning plan.");
  }

  function updateStatus(recommendation, status) {
    onStatusChange(type, recommendation.id, status);
    onMessage(status === "validated" ? "Rekomendasi berhasil divalidasi." : status === "needs-revision" ? "Rekomendasi ditandai perlu revisi." : "Status rekomendasi dikembalikan ke menunggu validasi.");
  }

  return (
    <section className="lp-detail-section lp-recommendations-section">
      <div className="lp-section-heading-row">
        <div><h3>{isUniversity ? "Rekomendasi universitas" : "Rekomendasi beasiswa"}</h3><p>Validasi setiap item berdasarkan sumber resmi sebelum LP dirilis. Anda juga dapat menambah, mengubah, atau menghapus rekomendasi.</p></div>
        <div className="lp-recommendation-heading-actions"><span>{rows.length} item</span><button type="button" className="lp-add-recommendation-button" onClick={openAddForm}><Plus size={14} /> Tambah rekomendasi</button></div>
      </div>
      <RecommendationTable rows={rows} type={type} onEdit={openEditForm} onDelete={handleDelete} onStatusChange={updateStatus} />
      {formMode && <RecommendationForm type={type} mode={formMode} recommendation={editingRecommendation} onCancel={closeForm} onSubmit={handleFormSubmit} />}
    </section>
  );
}

function RecommendationTable({ rows, type, onEdit, onDelete, onStatusChange }) {
  const isUniversity = type === "universities";
  return (
    <div className="lp-recommendation-table-wrapper">
      <table className="lp-table lp-review-recommendation-table">
        <caption className="sr-only">Daftar rekomendasi {isUniversity ? "universitas" : "beasiswa"} untuk learning plan ini</caption>
        <thead>
          {isUniversity ? <tr><th>Universitas & program</th><th>Target</th><th>Fit score</th><th>Deadline</th><th>Status</th><th>Sumber</th><th>Aksi</th></tr> : <tr><th>Beasiswa & provider</th><th>Coverage</th><th>Eligibility</th><th>Deadline</th><th>Status</th><th>Sumber</th><th>Aksi</th></tr>}
        </thead>
        <tbody>
          {rows.map((row) => <tr key={row.id}>
            {isUniversity ? <>
              <td><strong>{row.university}</strong><span>{row.program} · {row.country} · {row.degreeLevel}</span></td>
              <td><strong>{row.degreeLevel}</strong><span>{row.intake}</span></td>
              <td><strong className="lp-fit-score">{row.fitScore}%</strong><span>kecocokan</span></td>
              <td className="lp-muted-cell">{row.deadline}</td>
            </> : <>
              <td><strong>{row.name}</strong><span>{row.provider} · {row.country} · {row.level}</span></td>
              <td><strong>{row.coverage}</strong></td>
              <td><span className="lp-recommendation-eligibility">{row.eligibility}</span></td>
              <td className="lp-muted-cell">{row.deadline}</td>
            </>}
            <td><RecommendationStatus status={row.status} /></td>
            <td><a className="lp-table-source-link" href={row.sourceUrl} target="_blank" rel="noreferrer">Buka sumber ↗</a></td>
            <td>
              <div className="lp-recommendation-actions">
                {row.status !== "validated" && <button type="button" className="lp-row-action validate" onClick={() => onStatusChange(row, "validated")}><ShieldCheck size={13} /> Validasi</button>}
                {row.status !== "needs-revision" && <button type="button" className="lp-row-action revise" onClick={() => onStatusChange(row, "needs-revision")}>Perlu revisi</button>}
                {row.status !== "review" && <button type="button" className="lp-row-action reset" onClick={() => onStatusChange(row, "review")}>Buka ulang</button>}
                <button type="button" className="lp-row-icon-action" aria-label={`Edit ${isUniversity ? row.university : row.name}`} title="Edit rekomendasi" onClick={() => onEdit(row)}><Pencil size={14} /></button>
                <button type="button" className="lp-row-icon-action danger" aria-label={`Hapus ${isUniversity ? row.university : row.name}`} title="Hapus rekomendasi" onClick={() => onDelete(row)}><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>)}
          {rows.length === 0 && <tr className="lp-empty-row"><td colSpan={7}>Belum ada rekomendasi untuk LP ini. Tambahkan rekomendasi pertama untuk memulai review.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const RECOMMENDATION_FORM_FIELDS = {
  universities: [
    { name: "university", label: "Nama universitas", type: "text", required: true },
    { name: "program", label: "Program / jurusan", type: "text", required: true },
    { name: "country", label: "Negara", type: "text", required: true },
    { name: "degreeLevel", label: "Jenjang", type: "text", required: true },
    { name: "intake", label: "Intake", type: "text", required: true },
    { name: "fitScore", label: "Fit score (%)", type: "number", required: true, min: 0, max: 100 },
    { name: "tuition", label: "Estimasi tuition", type: "text" },
    { name: "deadline", label: "Deadline", type: "text", required: true },
    { name: "sourceUrl", label: "URL sumber resmi", type: "url", required: true },
    { name: "sourceCheckedAt", label: "Terakhir dicek", type: "text" },
    { name: "notes", label: "Catatan validasi", type: "textarea" },
  ],
  scholarships: [
    { name: "name", label: "Nama beasiswa", type: "text", required: true },
    { name: "provider", label: "Provider", type: "text", required: true },
    { name: "country", label: "Negara", type: "text", required: true },
    { name: "level", label: "Jenjang", type: "text", required: true },
    { name: "coverage", label: "Coverage", type: "text", required: true },
    { name: "deadline", label: "Deadline", type: "text", required: true },
    { name: "eligibility", label: "Eligibility", type: "textarea", required: true },
    { name: "sourceUrl", label: "URL sumber resmi", type: "url", required: true },
    { name: "sourceCheckedAt", label: "Terakhir dicek", type: "text" },
    { name: "notes", label: "Catatan validasi", type: "textarea" },
  ],
};

function RecommendationForm({ type, mode, recommendation, onCancel, onSubmit }) {
  const fields = RECOMMENDATION_FORM_FIELDS[type];
  const [form, setForm] = useState(() => getRecommendationFormValues(type, recommendation));
  const [error, setError] = useState("");
  const isUniversity = type === "universities";

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    const missingField = fields.find((field) => field.required && !String(form[field.name] ?? "").trim());
    if (missingField) {
      setError(`${missingField.label} wajib diisi.`);
      return;
    }
    if (isUniversity && (Number(form.fitScore) < 0 || Number(form.fitScore) > 100)) {
      setError("Fit score harus berada di antara 0 dan 100.");
      return;
    }
    onSubmit({ ...form, ...(isUniversity ? { fitScore: Number(form.fitScore) } : {}) });
  }

  return (
    <div className="lp-recommendation-form" role="dialog" aria-modal="true" aria-labelledby="recommendation-form-title">
      <div className="lp-recommendation-form-header"><div><span className="lp-drawer-eyebrow">{mode === "edit" ? "EDIT REKOMENDASI" : "REKOMENDASI BARU"}</span><h4 id="recommendation-form-title">{mode === "edit" ? "Edit " : "Tambah "}{isUniversity ? "rekomendasi universitas" : "rekomendasi beasiswa"}</h4><p>Lengkapi data berdasarkan sumber resmi. Item baru otomatis berstatus menunggu validasi.</p></div><button type="button" className="lp-close-button" aria-label="Tutup form" onClick={onCancel}><X size={16} /></button></div>
      <form className="lp-recommendation-form-grid" onSubmit={submitForm}>
        {fields.map((field) => <label key={field.name} className={`lp-recommendation-form-field ${field.type === "textarea" ? "wide" : ""}`}><span>{field.label}{field.required ? " *" : ""}</span>{field.type === "textarea" ? <textarea rows={3} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} /> : <input type={field.type} min={field.min} max={field.max} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} />}</label>)}
        {error && <p className="lp-form-error" role="alert">{error}</p>}
        <div className="lp-recommendation-form-actions"><button type="button" className="lp-secondary-action" onClick={onCancel}>Batal</button><button type="submit" className="lp-primary-action"><Save size={14} /> Simpan rekomendasi</button></div>
      </form>
    </div>
  );
}

function getRecommendationFormValues(type, recommendation) {
  const fields = RECOMMENDATION_FORM_FIELDS[type];
  return fields.reduce((values, field) => ({ ...values, [field.name]: recommendation?.[field.name] ?? "" }), {});
}

function ValidationCheck({ checked, onChange, label, detail }) {
  return <label className={`lp-validation-check ${checked ? "checked" : ""}`}><input type="checkbox" checked={checked} onChange={onChange} /><span className="lp-validation-box"><CheckCircle2 size={14} /></span><span><strong>{label}</strong><small>{detail}</small></span></label>;
}

function SourcePreview({ source, onClose }) {
  if (!source) return null;

  return <div className="lp-source-preview">
    <div className="lp-source-preview-header"><div><strong>{source.title}</strong><small>{source.description}</small></div><button type="button" onClick={onClose}>Tutup</button></div>
    <div className="lp-source-preview-sections">{source.sections.map((section) => <section key={section.title}><h4>{section.title}</h4><div className="lp-source-preview-grid">{section.items.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></section>)}</div>
  </div>;
}

function getInitialValidationChecks(lp) {
  const complete = lp.status !== "review";
  return { student: complete, target: complete, external: complete };
}

function getInternalSourcePreviews(lp) {
  const handover = mockMoHandoverForms.find((record) => record.studentId === lp.studentId);
  const profile = mockMoStudentProfiles.find((record) => record.id === lp.studentId);
  const report = getSubmittedDiagnosingReport(lp.studentId);
  const completedScores = report?.form?.assessmentScores
    ? Object.values(report.form.assessmentScores).filter((score) => Number.isInteger(score)).length
    : 0;

  return [
    {
      id: "handover",
      label: "Handover student",
      title: "Form handover student",
      description: "Data intake yang diteruskan dari Sales sebelum onboarding.",
      sections: [
        { title: "Metadata handover", items: [
          { label: "Status", value: handover?.handoverStatus === "complete" ? "Lengkap" : "Belum lengkap" },
          { label: "ID handover", value: handover?.id ?? "Belum tersedia" },
          { label: "Diteruskan oleh", value: handover?.submittedBy ?? "Belum tersedia" },
          { label: "Waktu submit", value: handover?.submittedAt ?? "Belum tersedia" },
        ] },
        { title: "Data intake", items: [
          { label: "Nama student", value: handover?.studentName ?? "Belum tersedia" },
          { label: "Email", value: handover?.email ?? "Belum tersedia" },
          { label: "No. HP", value: handover?.phone ?? "Belum tersedia" },
          { label: "Paket", value: handover?.packageName ?? "Belum tersedia" },
          { label: "Program", value: handover?.program ?? "Belum tersedia" },
          { label: "Payment date", value: handover?.paymentDate ?? "Belum tersedia" },
        ] },
        { title: "Profil dan target awal", items: [
          { label: "Pendidikan saat ini", value: handover?.currentEducation ?? "Belum tersedia" },
          { label: "Target jenjang", value: handover?.targetDegree ?? "Belum tersedia" },
          { label: "Target intake", value: handover?.targetIntake ?? "Belum tersedia" },
          { label: "Negara tujuan", value: handover?.targetCountries ?? "Belum tersedia" },
          { label: "Universitas tujuan", value: handover?.targetUniversities ?? "Belum tersedia" },
          { label: "Jurusan tujuan", value: handover?.intendedMajor ?? "Belum tersedia" },
          { label: "Budget", value: handover?.budgetRange ?? "Belum tersedia" },
          { label: "Kemampuan bahasa", value: handover?.englishLevel ?? "Belum tersedia" },
        ] },
        { title: "Konteks student", items: [
          { label: "Goals student", value: handover?.studentGoals ?? "Belum tersedia" },
          { label: "Catatan tambahan", value: handover?.additionalNotes ?? "Belum tersedia" },
        ] },
      ],
    },
    {
      id: "profile",
      label: "Profil SLMS",
      title: "Profil student di SLMS",
      description: "Snapshot profil terakhir yang tersinkron dari Learning System.",
      sections: [
        { title: "Metadata profil", items: [
          { label: "Status profil", value: profile?.profileStatus === "complete" ? "Lengkap" : "Belum lengkap" },
          { label: "Terakhir sinkron", value: profile?.lastSyncedAt ?? "Belum tersedia" },
        ] },
        { title: "Identitas student", items: [
          { label: "Nama student", value: profile?.name ?? "Belum tersedia" },
          { label: "Email", value: profile?.email ?? "Belum tersedia" },
          { label: "No. HP", value: profile?.phone ?? "Belum tersedia" },
          { label: "Tanggal lahir", value: profile?.dateOfBirth ?? "Belum tersedia" },
          { label: "Kota", value: profile?.city ?? "Belum tersedia" },
          { label: "Gender", value: profile?.gender ?? "Belum tersedia" },
          { label: "Passport", value: profile?.passport ?? "Belum tersedia" },
          { label: "Kontak orang tua", value: profile?.parentContact ?? "Belum tersedia" },
        ] },
        { title: "Pendidikan dan kemampuan", items: [
          { label: "Pendidikan saat ini", value: profile?.currentEducation ?? "Belum tersedia" },
          { label: "Jenjang tujuan", value: profile?.targetDegree ?? "Belum tersedia" },
          { label: "Target intake", value: profile?.targetIntake ?? "Belum tersedia" },
          { label: "Jurusan tujuan", value: profile?.intendedMajor ?? "Belum tersedia" },
          { label: "Negara tujuan", value: profile?.targetCountries ?? "Belum tersedia" },
          { label: "English level", value: profile?.englishLevel ?? "Belum tersedia" },
          { label: "Language test", value: profile?.languageTest ?? "Belum tersedia" },
          { label: "Standardized test", value: profile?.standardizedTest ?? "Belum tersedia" },
          { label: "Achievements", value: profile?.achievements ?? "Belum tersedia" },
        ] },
        { title: "Goals dan preferensi", items: [
          { label: "Minat", value: profile?.interests ?? "Belum tersedia" },
          { label: "Major goals", value: profile?.majorGoals ?? "Belum tersedia" },
          { label: "Country goals", value: profile?.countryGoals ?? "Belum tersedia" },
          { label: "Avoided countries", value: profile?.avoidedCountries ?? "Belum tersedia" },
          { label: "Goals student", value: profile?.studentGoals ?? "Belum tersedia" },
          { label: "Target beasiswa", value: profile?.scholarshipGoals ?? "Belum tersedia" },
          { label: "Target universitas", value: profile?.universityGoals ?? "Belum tersedia" },
          { label: "Preferensi funding", value: profile?.fundingPreference ?? "Belum tersedia" },
          { label: "Preferensi jadwal", value: profile?.schedulePreference ?? "Belum tersedia" },
          { label: "Konteks lain", value: profile?.otherContext ?? "Belum tersedia" },
        ] },
      ],
    },
    {
      id: "diagnosing",
      label: "Diagnosing checklist",
      title: "Diagnosing checklist MO",
      description: "Hasil assessment dan recommendation dari report onboarding MO.",
      sections: [
        { title: "Status dan konteks", items: [
          { label: "Status report", value: report?.status === "submitted" ? "Submitted" : "Belum ada report submitted" },
          { label: "Waktu submit", value: report?.submittedAt ? formatReportDate(report.submittedAt) : "Belum tersedia" },
          { label: "Skor terisi", value: report ? `${completedScores}/${DIAGNOSING_CRITERIA.length} kriteria` : "Belum tersedia" },
          { label: "Tipe student", value: report?.form?.studentType ?? "Belum tersedia" },
          { label: "Student demanding", value: report?.form?.isDemanding ?? "Belum tersedia" },
          { label: "Veteran study abroad", value: report?.form?.isVeteran ?? "Belum tersedia" },
          { label: "Ngotot pada pilihan tertentu", value: report?.form?.isStubborn ?? "Belum tersedia" },
          { label: "Research proposal required", value: report?.form?.researchProposalRequired ?? "Belum tersedia" },
        ] },
        { title: "Profile confirmation", items: getProfileConfirmationItems(report) },
        ...getDiagnosingSections(report),
        { title: "Learning plan mapping", items: [
          { label: "Area terpilih", value: getLearningPlanFocusLabels(report) },
          { label: "Jumlah area", value: report?.form?.learningPlanFocus?.length ? `${report.form.learningPlanFocus.length} area` : "Belum ada" },
        ] },
      ],
    },
  ];
}

function getProfileConfirmationItems(report) {
  const profileConfirmation = report?.form?.profileConfirmation ?? {};
  return PROFILE_CONFIRMATION_FIELDS.map((field) => ({
    label: field.label,
    value: profileConfirmation[field.id]?.toString().trim() || "Belum diisi",
  }));
}

function getDiagnosingSections(report) {
  const scores = report?.form?.assessmentScores ?? {};
  const recommendations = report?.form?.assessmentRecommendations ?? {};
  const criteriaByCategory = DIAGNOSING_CRITERIA.reduce((groups, criterion) => {
    const current = groups[criterion.category] ?? [];
    current.push({
      label: criterion.label,
      value: `Skor: ${Number.isInteger(scores[criterion.id]) ? scores[criterion.id] : "Belum diisi"} · Recommendation: ${recommendations[criterion.id]?.trim() || "Belum diisi"}`,
    });
    groups[criterion.category] = current;
    return groups;
  }, {});

  return Object.entries(criteriaByCategory).map(([category, items]) => ({
    title: `Diagnosing · ${category}`,
    items,
  }));
}

function getLearningPlanFocusLabels(report) {
  const selectedIds = report?.form?.learningPlanFocus ?? [];
  if (!selectedIds.length) return "Belum ada area yang dipilih";
  return LEARNING_PLAN_CATEGORIES
    .filter((category) => selectedIds.includes(category.id))
    .map((category) => category.label)
    .join("; ");
}

function formatReportDate(value) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function getSubmittedDiagnosingReport(studentId) {
  if (typeof window === "undefined") return null;

  try {
    const serialized = window.localStorage.getItem(`mo_onboarding_report_${studentId}`);
    return serialized ? JSON.parse(serialized) : null;
  } catch {
    return null;
  }
}

function parseLines(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function formatUpdatedAt() {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function getExternalReferenceLinks(lp) {
  const country = lp.targetCountries.split(",")[0].trim();
  const referencesByCountry = {
    Australia: { study: "https://www.studyaustralia.gov.au/", scholarship: "https://www.australiaawardsindonesia.org/" },
    "United Kingdom": { study: "https://study-uk.britishcouncil.org/", scholarship: "https://www.chevening.org/scholarships/" },
    "United States": { study: "https://educationusa.state.gov/", scholarship: "https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies" },
    Canada: { study: "https://www.educanada.ca/index.aspx?lang=eng", scholarship: "https://www.educanada.ca/scholarships-bourses/index.aspx?lang=eng" },
    Singapore: { study: "https://www.moe.gov.sg/education", scholarship: "https://www.moe.gov.sg/financial-matters/awards-scholarships" },
    Germany: { study: "https://www.daad.de/en/studying-in-germany/", scholarship: "https://www.daad.de/en/studying-in-germany/scholarships/" },
  };
  const references = referencesByCountry[country] ?? { study: "https://www.educations.com/", scholarship: "https://www.scholarships.com/" };
  return [
    { label: `Panduan studi ${country}`, description: "Sumber resmi studi di negara tujuan", href: references.study },
    { label: "Referensi beasiswa resmi", description: "Cek eligibility, deadline, dan benefit", href: references.scholarship },
  ];
}

function DetailSection({ title, children }) {
  return <section className="lp-detail-section"><h3>{title}</h3><div className="lp-detail-grid">{children}</div></section>;
}

function DetailItem({ label, value }) {
  return <div className="lp-detail-item"><span>{label}</span><strong>{value}</strong></div>;
}
