import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { useScholarships } from "../hooks/useScholarships";
import {
  SCHOLARSHIP_LEVEL_OPTIONS,
  SCHOLARSHIP_STATUS_OPTIONS,
} from "../data/mockScholarships";
import AcademicSidebar from "../components/AcademicSidebar";
import TopbarActions from "../components/TopbarActions";
import "./StudentBuddyDashboard.css";
import "./AcademicMasterData.css";
import { useCollectionStore } from "../hooks/useCollectionStore";
import {
  SCHOLARSHIP_SOURCE_URLS,
  SCHOLARSHIP_VERIFICATIONS_KEY,
  mockScholarshipVerificationsSeed,
} from "../data/mockScholarshipVerifications";

const EMPTY_FORM = {
  name: "", provider: "", scholarshipType: "University Scholarship", fundingType: "",
  coverage: "", level: "S1", country: "", continent: "", university: "",
  programCategory: "", openRegistration: "", earliestDeadline: "", currency: "",
  benefitNotes: "", documentCategory: "", documentDetail: "", eligibilityNotes: "",
  sourceUrl: "", sourceCheckedAt: "", status: "active",
};

function formatDate(value) {
  if (!value) return "—";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(parsed);
}

function isSameScholarship(item, verification) {
  const itemName = item.name?.trim().toLowerCase();
  const verificationName = verification.name?.trim().toLowerCase();
  const itemProvider = item.provider?.trim().toLowerCase();
  const verificationProvider = verification.provider?.trim().toLowerCase();
  return itemName === verificationName && (!verificationProvider || itemProvider === verificationProvider);
}

function createReviewForm(verification, existingItem) {
  const sourceUrl = verification.sourceUrl || SCHOLARSHIP_SOURCE_URLS[verification.id] || "";
  const baseForm = {
    ...EMPTY_FORM,
    ...(existingItem ?? {}),
    name: existingItem?.name || verification.name || "",
    provider: existingItem?.provider || verification.provider || "",
    coverage: existingItem?.coverage || verification.coverage || "",
    level: existingItem?.level || verification.level || "S1",
    fundingType: existingItem?.fundingType || "",
    eligibilityNotes: existingItem?.eligibilityNotes || verification.eligibility || "",
    benefitNotes: existingItem?.benefitNotes || verification.applicationSteps || "",
    sourceUrl: existingItem?.sourceUrl || sourceUrl,
    sourceCheckedAt: existingItem?.sourceCheckedAt || "",
    status: existingItem?.status || "active",
  };

  return (verification.changes ?? []).reduce((currentForm, change) => {
    if (!change.field || !Object.prototype.hasOwnProperty.call(currentForm, change.field)) return currentForm;
    return { ...currentForm, [change.field]: change.after ?? "" };
  }, baseForm);
}

const SOURCE_PREVIEW_COLUMNS = [
  ["scholarship", "Scholarship"], ["degree", "Degree"], ["grade", "Grade"],
  ["continent", "Continent"], ["country", "Country"], ["open_registration", "Open registration"],
  ["earliest_deadline", "Earliest deadline"], ["currency_beasiswa", "Currency"],
  ["scholarship_type", "Scholarship type"], ["notes_benefit", "Benefit"],
  ["document_category", "Document category"], ["notes_document_detail", "Document detail"],
  ["min__gpa__scale_100_", "Min GPA / 100"], ["min__gpa__scale_4_0_", "Min GPA / 4"],
  ["program_category", "Program category"], ["funding_type", "Funding type"],
  ["min_age", "Min age"], ["standardized_test", "Standardized test"], ["a_level", "A-level"],
  ["nationality", "Nationality"], ["min_gpa_raport", "Min GPA raport"], ["ielts__overall_", "IELTS"],
  ["minimum_total_score_sat", "SAT"], ["min_score_delf_dalf", "DELF / DALF"],
  ["min_score_dsh__germany_", "DSH Germany"], ["min_score_hsk", "HSK"], ["min_score_jlpt", "JLPT"],
  ["min_score_tocfl", "TOCFL"], ["min_score_toefl_ibt", "TOEFL iBT"], ["minimum_score_act", "ACT"],
  ["eligibility__notes_", "Eligibility notes"], ["university", "University"],
];

function sourceCellValue(item, key) {
  const value = item.sourceData?.[key];
  if (!value) return "—";
  if (key === "open_registration" || key === "earliest_deadline") return formatDate(value);
  return value;
}

export default function AcademicScholarships({ user, onLogout }) {
  const navigate = useNavigate();
  const isLpChecker = user?.role === "lp-checker";
  const canManage = !isLpChecker;
  const roleLabel = isLpChecker ? "LP Checker" : "Academic";
  const [searchParams] = useSearchParams();
  const scholarshipApi = useScholarships();
  const reviewId = searchParams.get("review");
  const verificationStore = useCollectionStore(
    SCHOLARSHIP_VERIFICATIONS_KEY,
    mockScholarshipVerificationsSeed
  );
  const reviewItem = verificationStore.items.find((item) => item.id === reviewId);
  const [formOpen, setFormOpen] = useState(canManage && (searchParams.get("add") === "1" || Boolean(reviewId)));
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => (reviewItem ? createReviewForm(reviewItem) : EMPTY_FORM));
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!canManage || !reviewId || !reviewItem || scholarshipApi.loading) return;

    const existingItem = scholarshipApi.items.find((item) => isSameScholarship(item, reviewItem));
    setEditingId(existingItem?.id ?? null);
    setForm(createReviewForm(reviewItem, existingItem));
    setSubmitError("");
    setFormOpen(true);
  }, [canManage, reviewId, reviewItem, scholarshipApi.items, scholarshipApi.loading]);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSubmitError("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    setSubmitError("");
    setForm({ ...EMPTY_FORM, ...item });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setSubmitError("");
    if (reviewId) navigate("/academic/scholarships", { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setSubmitError("Nama beasiswa wajib diisi.");
      return;
    }
    try {
      if (editingId) await scholarshipApi.updateItem(editingId, form);
      else await scholarshipApi.addItem(form);
      if (reviewId) {
        verificationStore.removeItem(reviewId);
        navigate("/academic/scholarships", { replace: true });
      } else {
        closeForm();
      }
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus data beasiswa ini?")) return;
    try {
      await scholarshipApi.removeItem(id);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className={`dashboard-page ${isLpChecker ? "lp-master-page" : "academic-master-page"}`}>
      <AcademicSidebar user={user} onLogout={onLogout} />
      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span><span className="breadcrumb-separator">›</span>
            <span>{roleLabel}</span><span className="breadcrumb-separator">›</span>
            <strong>Master Data · Scholarship</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="master-data-content fade-in-up" style={{ "--delay": "0ms" }}>
          <div className="master-data-header-row">
            <div>
              <p className="master-data-eyebrow">Master Data Academic</p>
              <h1>Scholarship <span className="master-data-count">{scholarshipApi.items.length}</span></h1>
              <p className="master-data-description">Data inti untuk rekomendasi learning plan dan pengecekan deadline beasiswa.</p>
            </div>
            {canManage && <button type="button" className="outline-button" onClick={openAddForm}><Plus size={18} />Tambah Beasiswa</button>}
          </div>

          {reviewItem && (
            <section className="scholarship-review-banner" aria-label="Review update beasiswa dari AI">
              <div className="scholarship-review-banner-icon"><CheckCircle2 size={18} /></div>
              <div className="scholarship-review-banner-copy">
                <strong>Review update dari AI sebelum dipublikasikan</strong>
                <p>{reviewItem.aiNote}</p>
                <span>Data yang disimpan di halaman ini akan menjadi data master beasiswa. Bandingkan dengan sumber resmi sebelum menandai selesai.</span>
              </div>
              <a className="scholarship-review-source" href={reviewItem.sourceUrl || SCHOLARSHIP_SOURCE_URLS[reviewItem.id]} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> Buka sumber resmi
              </a>
            </section>
          )}

          {scholarshipApi.error && <p className="master-data-form-error">{scholarshipApi.error}. Pastikan server backend sudah berjalan.</p>}

          {formOpen && (
            <form className="master-data-form scholarship-form" onSubmit={handleSubmit}>
              <div className="master-data-form-header">
                <div><p className="master-data-eyebrow">Data scholarship</p><h3>{reviewId ? (editingId ? "Validasi & Edit Beasiswa" : "Tambahkan Beasiswa dari Update AI") : editingId ? "Edit Beasiswa" : "Tambah Beasiswa Baru"}</h3></div>
                <button type="button" className="icon-round-button" onClick={closeForm} aria-label="Tutup"><X size={16} /></button>
              </div>
              {submitError && <p className="master-data-form-error">{submitError}</p>}
              <div className="master-data-form-grid scholarship-form-grid">
                <label className="field-span-2"><span>Nama Beasiswa *</span><input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="cth. LPDP" autoFocus /></label>
                <label><span>Penyelenggara</span><input type="text" value={form.provider} onChange={(e) => updateField("provider", e.target.value)} placeholder="cth. Australian Government" /></label>
                <label><span>Tipe Beasiswa</span><select value={form.scholarshipType} onChange={(e) => updateField("scholarshipType", e.target.value)}><option value="">Pilih tipe</option><option value="Government Scholarship">Government Scholarship</option><option value="University Scholarship">University Scholarship</option><option value="Private Scholarship">Private Scholarship</option></select></label>
                <label><span>Jenis Pendanaan</span><select value={form.fundingType} onChange={(e) => updateField("fundingType", e.target.value)}><option value="">Pilih pendanaan</option><option value="Fully Funded">Fully Funded</option><option value="Partially Funded">Partially Funded</option><option value="Tuition Waiver">Tuition Waiver</option></select></label>
                <label><span>Cakupan / Benefit Singkat</span><input type="text" value={form.coverage} onChange={(e) => updateField("coverage", e.target.value)} placeholder="cth. Full tuition + living allowance" /></label>
                <label><span>Jenjang</span><select value={form.level} onChange={(e) => updateField("level", e.target.value)}>{SCHOLARSHIP_LEVEL_OPTIONS.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
                <label><span>Negara</span><input type="text" value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="cth. Australia" /></label>
                <label><span>Benua</span><input type="text" value={form.continent} onChange={(e) => updateField("continent", e.target.value)} placeholder="cth. Australia" /></label>
                <label><span>Universitas</span><input type="text" value={form.university} onChange={(e) => updateField("university", e.target.value)} placeholder="Boleh lebih dari satu" /></label>
                <label><span>Kategori Program</span><input type="text" value={form.programCategory} onChange={(e) => updateField("programCategory", e.target.value)} placeholder="cth. Data Science, Engineering" /></label>
                <label><span>Pendaftaran Dibuka</span><input type="date" value={form.openRegistration} onChange={(e) => updateField("openRegistration", e.target.value)} /></label>
                <label><span>Deadline Terawal</span><input type="date" value={form.earliestDeadline} onChange={(e) => updateField("earliestDeadline", e.target.value)} /></label>
                <label><span>Mata Uang</span><input type="text" value={form.currency} onChange={(e) => updateField("currency", e.target.value)} placeholder="cth. AUD" /></label>
                <label><span>Status</span><select value={form.status} onChange={(e) => updateField("status", e.target.value)}>{SCHOLARSHIP_STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
                <label className="field-span-2"><span>Benefit / Catatan Pendanaan</span><textarea value={form.benefitNotes} onChange={(e) => updateField("benefitNotes", e.target.value)} placeholder="Rincian tuition fee, living allowance, tiket, dan benefit lainnya" rows="3" /></label>
                <label><span>Kategori Dokumen</span><input type="text" value={form.documentCategory} onChange={(e) => updateField("documentCategory", e.target.value)} placeholder="cth. Transcript, reference letter" /></label>
                <label><span>Dokumen Detail</span><textarea value={form.documentDetail} onChange={(e) => updateField("documentDetail", e.target.value)} placeholder="Detail dokumen yang perlu disiapkan" rows="3" /></label>
                <label className="field-span-2"><span>Catatan Eligibility</span><textarea value={form.eligibilityNotes} onChange={(e) => updateField("eligibilityNotes", e.target.value)} placeholder="Ringkasan syarat usia, kewarganegaraan, GPA, bahasa, atau tes standar" rows="3" /></label>
                <label className="field-span-2"><span>URL Sumber Resmi</span><input type="url" value={form.sourceUrl} onChange={(e) => updateField("sourceUrl", e.target.value)} placeholder="https://..." /></label>
                <label><span>Sumber Dicek Pada</span><input type="date" value={form.sourceCheckedAt} onChange={(e) => updateField("sourceCheckedAt", e.target.value)} /></label>
              </div>
              <div className="master-data-form-actions"><button type="button" className="text-button" onClick={closeForm}>Batal</button><button type="submit" className="outline-button">{reviewId ? "Simpan & Tandai Terverifikasi" : editingId ? "Simpan Perubahan" : "Tambah"}</button></div>
            </form>
          )}

          <section className="master-data-table-card scholarship-table-card">
            <div className="master-data-table-scroll">
              <table className="master-data-table scholarship-table">
                <thead>
                  <tr>
                    {SOURCE_PREVIEW_COLUMNS.map(([key, label], index) => <th key={key} className={index === 0 ? "source-sticky-column" : ""}>{label}</th>)}
                    {canManage && <th className="actions-column">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {scholarshipApi.items.map((item) => (
                    <tr key={item.id}>
                      {SOURCE_PREVIEW_COLUMNS.map(([key], index) => {
                        const value = sourceCellValue(item, key);
                        return <td key={key} className={index === 0 ? "source-sticky-column" : ""} title={value}>{value}</td>;
                      })}
                      {canManage && <td className="actions-column"><div className="row-actions"><button type="button" className="icon-round-button" aria-label="Edit" onClick={() => openEditForm(item)}><Pencil size={14} /></button><button type="button" className="icon-round-button danger" aria-label="Hapus" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>}
                    </tr>
                  ))}
                  {scholarshipApi.items.length === 0 && <tr className="empty-row"><td colSpan={SOURCE_PREVIEW_COLUMNS.length + (canManage ? 1 : 0)}>{scholarshipApi.loading ? "Memuat data..." : "Belum ada data beasiswa."}</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
