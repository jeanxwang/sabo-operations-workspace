import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { List, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
import { useScholarships } from "../hooks/useScholarships";
import { SCHOLARSHIP_LEVEL_OPTIONS } from "../data/mockScholarships";
import AcademicSidebar from "../components/AcademicSidebar";
import "./StudentBuddyDashboard.css";
import "./AcademicMasterData.css";

const EMPTY_FORM = { name: "", provider: "", coverage: "", level: "S1" };

export default function AcademicScholarships({ user, onLogout }) {
  const [searchParams] = useSearchParams();
  const scholarshipApi = useScholarships();

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
      name: item.name,
      provider: item.provider,
      coverage: item.coverage,
      level: item.level,
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
    if (!form.name.trim()) return;

    try {
      if (editingId) {
        await scholarshipApi.updateItem(editingId, form);
      } else {
        await scholarshipApi.addItem(form);
      }
      closeForm();
    } catch (err) {
      setSubmitError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await scholarshipApi.removeItem(id);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="dashboard-page">
      <AcademicSidebar user={user} />

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>Academic</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Scholarship</strong>
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
            <h1>Scholarship ({scholarshipApi.items.length})</h1>
            <button type="button" className="outline-button" onClick={openAddForm}>
              <Plus size={18} />
              Tambah Beasiswa
            </button>
          </div>

          {formOpen && (
            <form className="master-data-form" onSubmit={handleSubmit}>
              <div className="master-data-form-header">
                <h3>{editingId ? "Edit Beasiswa" : "Tambah Beasiswa Baru"}</h3>
                <button type="button" className="icon-round-button" onClick={closeForm} aria-label="Tutup">
                  <X size={16} />
                </button>
              </div>

              {submitError && <p className="master-data-form-error">{submitError}</p>}

              <div className="master-data-form-grid">
                <label>
                  <span>Nama Beasiswa</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="cth. LPDP"
                    autoFocus
                  />
                </label>
                <label>
                  <span>Penyelenggara</span>
                  <input
                    type="text"
                    value={form.provider}
                    onChange={(e) => setForm((prev) => ({ ...prev, provider: e.target.value }))}
                    placeholder="cth. Kemendikbud RI"
                  />
                </label>
                <label>
                  <span>Cakupan</span>
                  <input
                    type="text"
                    value={form.coverage}
                    onChange={(e) => setForm((prev) => ({ ...prev, coverage: e.target.value }))}
                    placeholder="cth. Full Funding"
                  />
                </label>
                <label>
                  <span>Jenjang</span>
                  <select
                    value={form.level}
                    onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
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
                {scholarshipApi.items.map((item) => (
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
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {scholarshipApi.items.length === 0 && (
                  <tr className="empty-row">
                    <td colSpan={5}>
                      {scholarshipApi.loading ? "Memuat data..." : "Belum ada data."}
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
