import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Pencil,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { useUniversityPrograms } from "../hooks/useUniversityPrograms";
import { useScholarships } from "../hooks/useScholarships";
import AcademicSidebar from "../components/AcademicSidebar";
import TopbarActions from "../components/TopbarActions";
import "./StudentBuddyDashboard.css";
import "./AcademicDashboard.css";
import { useCollectionStore } from "../hooks/useCollectionStore";
import {
  SCHOLARSHIP_VERIFICATIONS_KEY,
  SCHOLARSHIP_SOURCE_URLS,
  mockScholarshipVerificationsSeed,
} from "../data/mockScholarshipVerifications";

export default function AcademicDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);

  const universityApi = useUniversityPrograms();
  const scholarshipApi = useScholarships();
  const [selectedVerification, setSelectedVerification] = useState(null);

  const verificationStore = useCollectionStore(
    SCHOLARSHIP_VERIFICATIONS_KEY,
    mockScholarshipVerificationsSeed
  );

  async function handleApproveVerification(item) {
    try {
      await scholarshipApi.addItem({
        name: item.name,
        provider: item.provider,
        coverage: item.coverage,
        level: item.level,
        fundingType: item.coverage,
        eligibilityNotes: item.eligibility,
        sourceUrl: getSourceUrl(item),
        sourceCheckedAt: new Date().toISOString().slice(0, 10),
        status: "active",
      });
      verificationStore.removeItem(item.id);
    } catch (err) {
      alert(err.message);
    }
  }

  function handleRejectVerification(id) {
    verificationStore.removeItem(id);
  }

  function getSourceUrl(item) {
    return (
      item.sourceUrl ||
      SCHOLARSHIP_SOURCE_URLS[item.id] ||
      `https://www.google.com/search?q=${encodeURIComponent(`${item.name} ${item.provider} official`)}`
    );
  }

  function openSource(item) {
    window.open(getSourceUrl(item), "_blank", "noopener,noreferrer");
  }

  function openVerificationEditor(item) {
    navigate(`/academic/scholarships?review=${encodeURIComponent(item.id)}`);
  }

  const totalUniversity = useCountUp(universityApi.items.length);
  const totalScholarship = useCountUp(scholarshipApi.items.length);

  const recentUniversity = universityApi.items.slice(0, 3);
  const recentScholarship = scholarshipApi.items.slice(0, 3);

  return (
    <main className="dashboard-page academic-dashboard-page">
      <AcademicSidebar user={user} onLogout={onLogout} />

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Academic</strong>
          </div>

          <TopbarActions />
        </header>

        <section className="dashboard-content">
          <div className="dashboard-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <h1>Welcome back, {displayName}!</h1>
          </div>

          <section className="academic-stat-grid fade-in-up" style={{ "--delay": "80ms" }}>
            <article className="academic-stat-card">
              <h2>Universitas &amp; Program</h2>
              <strong>{totalUniversity}</strong>
              <p>Total data program yang tersedia untuk direkomendasikan SSO.</p>
              <button
                type="button"
                className="outline-button"
                onClick={() => navigate("/academic/universities?add=1")}
              >
                <Plus size={18} />
                Tambah Program
              </button>
            </article>

            <article className="academic-stat-card">
              <h2>Beasiswa</h2>
              <strong>{totalScholarship}</strong>
              <p>Total data beasiswa yang tersedia untuk direkomendasikan SSO.</p>
              <button
                type="button"
                className="outline-button"
                onClick={() => navigate("/academic/scholarships?add=1")}
              >
                <Plus size={18} />
                Tambah Beasiswa
              </button>
            </article>
          </section>

          <section className="academic-recent-section fade-in-up" style={{ "--delay": "160ms" }}>
            <div className="academic-recent-card">
              <header className="academic-recent-header">
                <h2>Baru Ditambahkan</h2>
                <div className="academic-recent-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate("/academic/universities")}
                  >
                    Universitas
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate("/academic/scholarships")}
                  >
                    Beasiswa
                    <ChevronRight size={16} />
                  </button>
                </div>
              </header>

              <div className="academic-recent-columns">
                <div>
                  <span className="academic-recent-label">Universitas & Program</span>
                  <ul className="academic-recent-list">
                    {recentUniversity.map((item) => (
                      <li key={item.id}>
                        <strong>{item.university}</strong>
                        <span>{item.program} • {item.country}</span>
                      </li>
                    ))}
                    {recentUniversity.length === 0 && (
                      <li className="academic-recent-empty">Belum ada data.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <span className="academic-recent-label">Beasiswa</span>
                  <ul className="academic-recent-list">
                    {recentScholarship.map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>
                        <span>{item.provider} • {item.coverage}</span>
                      </li>
                    ))}
                    {recentScholarship.length === 0 && (
                      <li className="academic-recent-empty">Belum ada data.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="academic-verify-section fade-in-up" style={{ "--delay": "220ms" }}>
            <div className="academic-verify-card">
              <header className="academic-verify-header">
                <h2>Verifikasi Beasiswa (Update AI)</h2>
                <span className="academic-verify-count">{verificationStore.items.length} menunggu</span>
              </header>

              {verificationStore.items.length > 0 ? (
                <div className="academic-verify-list">
                  {verificationStore.items.map((item) => (
                    <article key={item.id} className="academic-verify-item">
                      <div className="academic-verify-item-info">
                        <button
                          type="button"
                          className="academic-verify-detail-trigger"
                          onClick={() => setSelectedVerification(item)}
                        >
                          <strong>{item.name}</strong>
                          <ChevronRight size={16} />
                        </button>
                        <span className="academic-verify-meta">
                          {item.provider} • {item.coverage} • {item.level}
                        </span>
                        <p className="academic-verify-note">{getVerificationHeadline(item)}</p>
                        <button
                          type="button"
                          className="academic-verify-change-trigger"
                          onClick={() => setSelectedVerification(item)}
                        >
                          <span>{getVerificationChangeLabel(item)}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="academic-verify-actions">
                        <button
                          type="button"
                          className="outline-button academic-verify-source"
                          onClick={() => openVerificationEditor(item)}
                        >
                          <Pencil size={15} />
                          Verifikasi &amp; edit
                        </button>
                        <button
                          type="button"
                          className="icon-round-button danger"
                          aria-label="Tolak"
                          onClick={() => handleRejectVerification(item.id)}
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          type="button"
                          className="outline-button academic-verify-approve"
                          onClick={() => handleApproveVerification(item)}
                        >
                          <CheckCircle2 size={16} />
                          Tandai Terverifikasi
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="academic-verify-empty">Tidak ada beasiswa yang perlu diverifikasi saat ini.</p>
              )}
            </div>
          </section>

        </section>
      </section>

      {selectedVerification && (
        <div className="academic-detail-overlay" onClick={() => setSelectedVerification(null)}>
          <section
            className="academic-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="academic-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="academic-detail-modal-header">
              <div>
                <span className="academic-detail-eyebrow">Detail update AI</span>
                <h2 id="academic-detail-title">{selectedVerification.name}</h2>
              </div>
              <button
                type="button"
                className="icon-round-button"
                aria-label="Tutup detail"
                onClick={() => setSelectedVerification(null)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="academic-detail-grid">
              <div>
                <span>Provider</span>
                <strong>{selectedVerification.provider}</strong>
              </div>
              <div>
                <span>Jenjang</span>
                <strong>{selectedVerification.level}</strong>
              </div>
              <div>
                <span>Cakupan</span>
                <strong>{selectedVerification.coverage}</strong>
              </div>
              <div>
                <span>Terdeteksi</span>
                <strong>{selectedVerification.detectedAt || "Belum tersedia"}</strong>
              </div>
            </div>

            <div className="academic-detail-section academic-change-section">
              <span>Kolom yang diubah AI</span>
              <VerificationChanges item={selectedVerification} />
            </div>
            <div className="academic-detail-section">
              <span>Konteks update</span>
              <p>{selectedVerification.aiDetails || selectedVerification.aiNote}</p>
            </div>

            <footer className="academic-detail-modal-footer">
              <button type="button" className="text-button" onClick={() => setSelectedVerification(null)}>
                Tutup
              </button>
              <button type="button" className="outline-button" onClick={() => { setSelectedVerification(null); openVerificationEditor(selectedVerification); }}>
                <Pencil size={16} />
                Edit data lengkap
              </button>
              <button type="button" className="outline-button" onClick={() => openSource(selectedVerification)}>
                <ExternalLink size={16} />
                Buka Situs Resmi
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

function getDisplayName(name) {
  if (!name) return "Academic Team";
  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
}

function getVerificationHeadline(item) {
  const changes = getVerificationChanges(item);
  if (changes.length === 0) return item.aiNote;
  if (changes.every((change) => change.before === "Belum ada data")) {
    return `${changes.length} kolom baru akan ditambahkan ke master data.`;
  }
  return `${changes.length} kolom master data berubah dan perlu diverifikasi.`;
}

function getVerificationChangeLabel(item) {
  const changes = getVerificationChanges(item);
  const isNewRecord = changes.length > 0 && changes.every((change) => change.before === "Belum ada data");
  return `Lihat detail perubahan · ${changes.length} ${isNewRecord ? "kolom baru" : "kolom berubah"}`;
}

function VerificationChanges({ item, compact = false }) {
  const changes = getVerificationChanges(item);
  if (changes.length === 0) return null;

  const visibleChanges = compact ? changes.slice(0, 2) : changes;
  return (
    <div className={`academic-change-list ${compact ? "compact" : ""}`}>
      {visibleChanges.map((change) => (
        <div key={change.field} className="academic-change-row">
          <strong>{change.label}</strong>
          <div className="academic-change-values">
            <span className="academic-change-before">{change.before}</span>
            <span className="academic-change-arrow">→</span>
            <span className="academic-change-after">{change.after}</span>
          </div>
        </div>
      ))}
      {compact && changes.length > visibleChanges.length && (
        <span className="academic-change-more">+{changes.length - visibleChanges.length} kolom lainnya</span>
      )}
    </div>
  );
}

function getVerificationChanges(item) {
  if (item.changes?.length) return item.changes;
  if (item.id === "ver-2") {
    return [{
      field: "coverage",
      label: "Cakupan / benefit",
      before: "Full Funding",
      after: item.coverage || "Full Funding + Living Allowance",
    }];
  }
  return [
    { field: "name", label: "Nama beasiswa", before: "Belum ada data", after: item.name || "—" },
    { field: "provider", label: "Penyelenggara", before: "Belum ada data", after: item.provider || "—" },
    { field: "coverage", label: "Cakupan / benefit", before: "Belum ada data", after: item.coverage || "—" },
    { field: "level", label: "Jenjang", before: "Belum ada data", after: item.level || "—" },
  ];
}
