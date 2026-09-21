import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useUniversityPrograms } from "../hooks/useUniversityPrograms";
import { DEGREE_LEVEL_OPTIONS } from "../data/mockUniversityPrograms";
import AcademicSidebar from "../components/AcademicSidebar";
import TopbarActions from "../components/TopbarActions";
import "./StudentBuddyDashboard.css";
import "./AcademicMasterData.css";

const EMPTY_FORM = { university: "", country: "", program: "", degreeLevel: "S1" };

export default function AcademicUniversities({ user, onLogout }) {
  const [searchParams] = useSearchParams();
  const universityApi = useUniversityPrograms();

  const [formOpen, setFormOpen] = useState(searchParams.get("add") === "1");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState("");

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSubmitError("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    setSubmitError("");
    setForm({
      university: item.university,
      country: item.country,
      program: item.program,
      degreeLevel: item.degreeLevel,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.university.trim() || !form.program.trim()) return;

    try {
      if (editingId) {
        await universityApi.updateItem(editingId, form);
      } else {
        await universityApi.addItem(form);
      }
      closeForm();
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await universityApi.removeItem(id);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="dashboard-page">
      <AcademicSidebar user={user} onLogout={onLogout} />

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>Academic</span>
            <span className="breadcrumb-separator">›</span>
            <strong>University &amp; Program</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="master-data-content fade-in-up" style={{ "--delay": "0ms" }}>
          <div className="master-data-header-row">
            <h1>University &amp; Program ({universityApi.items.length})</h1>
            <button type="button" className="outline-button" onClick={openAddForm}>
              <Plus size={18} />
              Tambah Program
            </button>
          </div>

          {formOpen && (
            <form className="master-data-form" onSubmit={handleSubmit}>
              <div className="master-data-form-header">
                <h3>{editingId ? "Edit Program" : "Tambah Program Baru"}</h3>
                <button type="button" className="icon-round-button" onClick={closeForm} aria-label="Tutup">
                  <X size={16} />
                </button>
              </div>

              {submitError && <p className="master-data-form-error">{submitError}</p>}

              <div className="master-data-form-grid">
                <label>
                  <span>Nama Universitas</span>
                  <input
                    type="text"
                    value={form.university}
                    onChange={(e) => setForm((prev) => ({ ...prev, university: e.target.value }))}
                    placeholder="cth. University of Melbourne"
                    autoFocus
                  />
                </label>
                <label>
                  <span>Negara</span>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="cth. Australia"
                  />
                </label>
                <label>
                  <span>Nama Program</span>
                  <input
                    type="text"
                    value={form.program}
                    onChange={(e) => setForm((prev) => ({ ...prev, program: e.target.value }))}
                    placeholder="cth. Master of Data Science"
                  />
                </label>
                <label>
                  <span>Jenjang</span>
                  <select
                    value={form.degreeLevel}
                    onChange={(e) => setForm((prev) => ({ ...prev, degreeLevel: e.target.value }))}
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
                {universityApi.items.map((item) => (
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
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {universityApi.items.length === 0 && (
                  <tr className="empty-row">
                    <td colSpan={5}>
                      {universityApi.loading ? "Memuat data..." : "Belum ada data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      </section>
    </main>
  );
}
