import { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Grid2X2, List, LogOut, Pencil, Plus, Trash2, X, BookOpen } from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { useCollectionStore } from "../hooks/useCollectionStore";
import {
  UNIVERSITY_PROGRAMS_KEY,
  DEGREE_LEVEL_OPTIONS,
  mockUniversityProgramsSeed,
} from "../data/mockUniversityPrograms";
import {
  SCHOLARSHIPS_KEY,
  SCHOLARSHIP_LEVEL_OPTIONS,
  mockScholarshipsSeed,
} from "../data/mockScholarships";
import "./StudentBuddyDashboard.css";
import "./AcademicMasterData.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

const EMPTY_UNIVERSITY_FORM = { university: "", country: "", program: "", degreeLevel: "S1" };
const EMPTY_SCHOLARSHIP_FORM = { name: "", provider: "", coverage: "", level: "S1" };

export default function AcademicMasterData({ user, onLogout }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "scholarship" ? "scholarship" : "university";

  const universityStore = useCollectionStore(UNIVERSITY_PROGRAMS_KEY, mockUniversityProgramsSeed);
  const scholarshipStore = useCollectionStore(SCHOLARSHIPS_KEY, mockScholarshipsSeed);

  const [formOpen, setFormOpen] = useState(searchParams.get("add") === "1");
  const [editingId, setEditingId] = useState(null);
  const [universityForm, setUniversityForm] = useState(EMPTY_UNIVERSITY_FORM);
  const [scholarshipForm, setScholarshipForm] = useState(EMPTY_SCHOLARSHIP_FORM);

  function switchTab(tab) {
    setSearchParams({ tab });
    setFormOpen(false);
    setEditingId(null);
    setUniversityForm(EMPTY_UNIVERSITY_FORM);
    setScholarshipForm(EMPTY_SCHOLARSHIP_FORM);
  }

  function openAddForm() {
    setEditingId(null);
    setUniversityForm(EMPTY_UNIVERSITY_FORM);
    setScholarshipForm(EMPTY_SCHOLARSHIP_FORM);
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    if (activeTab === "university") {
      setUniversityForm({
        university: item.university,
        country: item.country,
        program: item.program,
        degreeLevel: item.degreeLevel,
      });
    } else {
      setScholarshipForm({
        name: item.name,
        provider: item.provider,
        coverage: item.coverage,
        level: item.level,
      });
    }
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function handleUniversitySubmit(event) {
    event.preventDefault();
    if (!universityForm.university.trim() || !universityForm.program.trim()) return;

    if (editingId) {
      universityStore.updateItem(editingId, universityForm);
    } else {
      universityStore.addItem({ id: `up-${Date.now()}`, ...universityForm });
    }
    closeForm();
  }

  function handleScholarshipSubmit(event) {
    event.preventDefault();
    if (!scholarshipForm.name.trim()) return;

    if (editingId) {
      scholarshipStore.updateItem(editingId, scholarshipForm);
    } else {
      scholarshipStore.addItem({ id: `sch-${Date.now()}`, ...scholarshipForm });
    }
    closeForm();
  }

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/academic/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/academic/master-data" className={navLinkClass}>
            <BookOpen size={22} />
            <span>Master Data</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Academic Team"}</strong>
            <small>Academic</small>
          </span>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>Academic</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Master Data</strong>
          </div>

          <div className="topbar-actions">
            <button type="button" aria-label="Menu">
              <List size={22} />
            </button>
            <button type="button" aria-label="Logout" onClick={onLogout}>
              <LogOut size={22} />
            </button>
          </div>
        </header>

        <section className="master-data-content fade-in-up" style={{ "--delay": "0ms" }}>
          <div className="master-data-header-row">
            <h1>Master Data Beasiswa &amp; Universitas</h1>

            <button type="button" className="outline-button" onClick={openAddForm}>
              <Plus size={18} />
              {activeTab === "university" ? "Tambah Program" : "Tambah Beasiswa"}
            </button>
          </div>

          <div className="master-data-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "university"}
              className={activeTab === "university" ? "md-tab-button active" : "md-tab-button"}
              onClick={() => switchTab("university")}
            >
              University &amp; Program ({universityStore.items.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "scholarship"}
              className={activeTab === "scholarship" ? "md-tab-button active" : "md-tab-button"}
              onClick={() => switchTab("scholarship")}
            >
              Scholarship ({scholarshipStore.items.length})
            </button>
          </div>

          {formOpen && activeTab === "university" && (
            <form className="master-data-form" onSubmit={handleUniversitySubmit}>
              <div className="master-data-form-header">
                <h3>{editingId ? "Edit Program" : "Tambah Program Baru"}</h3>
                <button type="button" className="icon-round-button" onClick={closeForm} aria-label="Tutup">
                  <X size={16} />
                </button>
              </div>

              <div className="master-data-form-grid">
                <label>
                  <span>Nama Universitas</span>
                  <input
                    type="text"
                    value={universityForm.university}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({ ...prev, university: e.target.value }))
                    }
                    placeholder="cth. University of Melbourne"
                    autoFocus
                  />
                </label>

                <label>
                  <span>Negara</span>
                  <input
                    type="text"
                    value={universityForm.country}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({ ...prev, country: e.target.value }))
                    }
                    placeholder="cth. Australia"
                  />
                </label>

                <label>
                  <span>Nama Program</span>
                  <input
                    type="text"
                    value={universityForm.program}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({ ...prev, program: e.target.value }))
                    }
                    placeholder="cth. Master of Data Science"
                  />
                </label>

                <label>
                  <span>Jenjang</span>
                  <select
                    value={universityForm.degreeLevel}
                    onChange={(e) =>
                      setUniversityForm((prev) => ({ ...prev, degreeLevel: e.target.value }))
                    }
                  >
                    {DEGREE_LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="master-data-form-actions">
                <button type="button" className="text-button" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" className="outline-button">
                  {editingId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          )}

          {formOpen && activeTab === "scholarship" && (
            <form className="master-data-form" onSubmit={handleScholarshipSubmit}>
              <div className="master-data-form-header">
                <h3>{editingId ? "Edit Beasiswa" : "Tambah Beasiswa Baru"}</h3>
                <button type="button" className="icon-round-button" onClick={closeForm} aria-label="Tutup">
                  <X size={16} />
                </button>
              </div>

              <div className="master-data-form-grid">
                <label>
                  <span>Nama Beasiswa</span>
                  <input
                    type="text"
                    value={scholarshipForm.name}
                    onChange={(e) =>
                      setScholarshipForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="cth. LPDP"
                    autoFocus
                  />
                </label>

                <label>
                  <span>Penyelenggara</span>
                  <input
                    type="text"
                    value={scholarshipForm.provider}
                    onChange={(e) =>
                      setScholarshipForm((prev) => ({ ...prev, provider: e.target.value }))
                    }
                    placeholder="cth. Kemendikbud RI"
                  />
                </label>

                <label>
                  <span>Cakupan</span>
                  <input
                    type="text"
                    value={scholarshipForm.coverage}
                    onChange={(e) =>
                      setScholarshipForm((prev) => ({ ...prev, coverage: e.target.value }))
                    }
                    placeholder="cth. Full Funding"
                  />
                </label>

                <label>
                  <span>Jenjang</span>
                  <select
                    value={scholarshipForm.level}
                    onChange={(e) =>
                      setScholarshipForm((prev) => ({ ...prev, level: e.target.value }))
                    }
                  >
                    {SCHOLARSHIP_LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="master-data-form-actions">
                <button type="button" className="text-button" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" className="outline-button">
                  {editingId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "university" ? (
            <section className="master-data-table-card">
              <table className="master-data-table">
                <thead>
                  <tr>
                    <th>Universitas</th>
                    <th>Negara</th>
                    <th>Program</th>
                    <th>Jenjang</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {universityStore.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.university}</strong>
                      </td>
                      <td>{item.country}</td>
                      <td>{item.program}</td>
                      <td className="mono-cell">{item.degreeLevel}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-round-button"
                            aria-label="Edit"
                            onClick={() => openEditForm(item)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-round-button danger"
                            aria-label="Hapus"
                            onClick={() => universityStore.removeItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {universityStore.items.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={5}>Belum ada data universitas/program.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          ) : (
            <section className="master-data-table-card">
              <table className="master-data-table">
                <thead>
                  <tr>
                    <th>Nama Beasiswa</th>
                    <th>Penyelenggara</th>
                    <th>Cakupan</th>
                    <th>Jenjang</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarshipStore.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.provider}</td>
                      <td>{item.coverage}</td>
                      <td className="mono-cell">{item.level}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-round-button"
                            aria-label="Edit"
                            onClick={() => openEditForm(item)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-round-button danger"
                            aria-label="Hapus"
                            onClick={() => scholarshipStore.removeItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {scholarshipStore.items.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={5}>Belum ada data beasiswa.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}

function getInitials(name) {
  if (!name) return "AC";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}