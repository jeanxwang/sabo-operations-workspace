import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Download,
  Filter,
  Grid2X2,
  LogOut,
  Minus,
  Plus,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { useStudents } from "../hooks/useStudents";
import { mockSsoStudents as mockSsoExtras } from "../data/mockSsoStudents";
import { mergeStudentExtras } from "../utils/mergeStudentExtras";
import "./StudentBuddyDashboard.css";
import "./SSOStudents.css";
import { useHandoverStore } from "../hooks/useHandoverStore";
import { mockHandoverSeed } from "../data/mockHandover";
import { useSearchParams } from "react-router-dom";
import { FOLLOW_UP_TAG_LABELS } from "../data/followUpTags";
import { useUniversityPrograms } from "../hooks/useUniversityPrograms";
import { useScholarships } from "../hooks/useScholarships";
import MessageComposerModal from "../components/MessageComposerModal";
import TopbarActions from "../components/TopbarActions";
import { interpolateMessage } from "../utils/messageTemplate";

const GRADE_OPTIONS = ["10", "11", "12"];
const DEGREE_OPTIONS = ["S1", "S2", "S3", "Gap Year"];
const RECIPIENT_LABELS = { SB: "Student Buddy", HL: "Hotline", RN: "Rania" };

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

function downloadCsv(students) {
  const headers = ["Nama", "ID", "Kelas", "Package", "Payment Date", "Phone Number"];
  const rows = students.map((s) => [s.name, s.id, s.grade, s.package, s.paymentDate, s.phoneNumber]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `students-export-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function SSOStudents({ user, onLogout }) {
  const navigate = useNavigate();
  const { items: apiStudents, loading } = useStudents();
  const [students, setStudents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerContext, setComposerContext] = useState(null);

  useEffect(() => {
    if (!loading && apiStudents.length > 0) {
      setStudents(mergeStudentExtras(apiStudents, mockSsoExtras, ["followUpTags", "recommendations"]));
    }
  }, [loading, apiStudents]);

  const activeTag = searchParams.get("tag");
  const activeGrades = (searchParams.get("grade") ?? "").split(",").filter(Boolean);
  const activeDegrees = (searchParams.get("degree") ?? "").split(",").filter(Boolean);

  const { items: handoverItems, addHandover } = useHandoverStore(mockHandoverSeed);
  const universityApi = useUniversityPrograms();
  const scholarshipApi = useScholarships();

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStudents = students
    .filter((student) => !activeTag || student.followUpTags?.includes(activeTag))
    .filter(
      (student) => activeGrades.length === 0 || activeGrades.includes(String(student.grade))
    )
    .filter(
      (student) => activeDegrees.length === 0 || activeDegrees.includes(student.currentDegree)
    )
    .filter((student) => {
      const keyword = searchKeyword.toLowerCase();
      return (
        student.name.toLowerCase().includes(keyword) ||
        student.id.toLowerCase().includes(keyword) ||
        (student.package ?? "").toLowerCase().includes(keyword) ||
        (student.packageName ?? "").toLowerCase().includes(keyword)
      );
    });

  const selectedStudent = students.find((student) => student.id === selectedId) ?? students[0] ?? null;

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selectedIds.has(student.id));

  function toggleGrade(grade) {
    const next = new URLSearchParams(searchParams);
    const current = new Set(activeGrades);
    if (current.has(grade)) current.delete(grade);
    else current.add(grade);
    if (current.size === 0) next.delete("grade");
    else next.set("grade", Array.from(current).join(","));
    setSearchParams(next);
  }

  function toggleDegree(degree) {
    const next = new URLSearchParams(searchParams);
    const current = new Set(activeDegrees);
    if (current.has(degree)) current.delete(degree);
    else current.add(degree);
    if (current.size === 0) next.delete("degree");
    else next.set("degree", Array.from(current).join(","));
    setSearchParams(next);
  }

  function handleAddRecommendation(studentId, category, item) {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              recommendations: {
                ...student.recommendations,
                [category]: [...student.recommendations[category], item],
              },
            }
          : student
      )
    );
  }

  function handleRemoveRecommendation(studentId, category, itemId) {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              recommendations: {
                ...student.recommendations,
                [category]: student.recommendations[category].filter((item) => item.id !== itemId),
              },
            }
          : student
      )
    );
  }

  function toggleSelectStudent(studentId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        filteredStudents.forEach((student) => next.delete(student.id));
      } else {
        filteredStudents.forEach((student) => next.add(student.id));
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleBulkExport() {
    const targets = students.filter((student) => selectedIds.has(student.id));
    downloadCsv(targets);
  }

  function openBulkComposer() {
    setComposerContext({ type: "bulk" });
    setComposerOpen(true);
  }

  function openSingleComposer(studentId, studentName) {
    setComposerContext({ type: "single", studentId, studentName });
    setComposerOpen(true);
  }

  function handleComposerSend(text, recipientValue) {
    const toLabel = RECIPIENT_LABELS[recipientValue] ?? recipientValue;

    if (composerContext?.type === "bulk") {
      const targets = students.filter((student) => selectedIds.has(student.id));
      targets.forEach((student) => {
        addHandover({
          id: `TTP-${Date.now()}-${student.id}`,
          studentId: student.id,
          studentName: student.name,
          fromSso: user?.name || "Jung Kook",
          toSb: toLabel,
          message: interpolateMessage(text, student),
          status: "belum",
          createdAt: "Baru saja",
        });
      });
      clearSelection();
    } else if (composerContext?.type === "single") {
      addHandover({
        id: `TTP-${Date.now()}`,
        studentId: composerContext.studentId,
        studentName: composerContext.studentName,
        fromSso: user?.name || "Jung Kook",
        toSb: toLabel,
        message: interpolateMessage(
          text,
          students.find((student) => student.id === composerContext.studentId)
        ),
        status: "belum",
        createdAt: "Baru saja",
      });
    }

    setComposerOpen(false);
    setComposerContext(null);
  }

  const hasActiveFilters = activeTag || activeGrades.length > 0 || activeDegrees.length > 0;

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/sso/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/sso/students" className={navLinkClass}>
            <Users size={22} />
            <span>Students</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Jung Kook"}</strong>
            <small>SSO</small>
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
            <span>SSO</span>
            <span className="breadcrumb-separator">›</span>
            <strong>Students</strong>
          </div>
          <TopbarActions />
        </header>

        <section className="sso-students-content">
          <div className="sso-students-main-column fade-in-up" style={{ "--delay": "0ms" }}>
            <div className="sso-students-header-row">
              <h1>Student Aktif ({students.length})</h1>

              <div className="sso-students-toolbar-actions">
                <div className="filter-popover-wrapper" ref={filterRef}>
                  <button
                    type="button"
                    className="outline-button small-toolbar-button"
                    onClick={() => setFilterOpen((open) => !open)}
                  >
                    <Filter size={16} />
                    Filter
                    {activeGrades.length + activeDegrees.length > 0 && (
                      <span className="filter-count-badge">
                        {activeGrades.length + activeDegrees.length}
                      </span>
                    )}
                  </button>

                  {filterOpen && (
                    <div className="filter-popover">
                      <div className="filter-popover-section">
                        <span className="filter-popover-label">Kelas</span>
                        <div className="filter-checkbox-list">
                          {GRADE_OPTIONS.map((grade) => (
                            <label key={grade} className="filter-checkbox-item">
                              <input
                                type="checkbox"
                                checked={activeGrades.includes(grade)}
                                onChange={() => toggleGrade(grade)}
                              />
                              Kelas {grade}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="filter-popover-section">
                        <span className="filter-popover-label">Jenjang</span>
                        <div className="filter-checkbox-list">
                          {DEGREE_OPTIONS.map((degree) => (
                            <label key={degree} className="filter-checkbox-item">
                              <input
                                type="checkbox"
                                checked={activeDegrees.includes(degree)}
                                onChange={() => toggleDegree(degree)}
                              />
                              {degree}
                            </label>
                          ))}
                        </div>
                      </div>

                      {(activeGrades.length > 0 || activeDegrees.length > 0) && (
                        <button
                          type="button"
                          className="text-button filter-popover-reset"
                          onClick={() => {
                            const next = new URLSearchParams(searchParams);
                            next.delete("grade");
                            next.delete("degree");
                            setSearchParams(next);
                          }}
                        >
                          Reset semua filter
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button type="button" className="outline-button small-toolbar-button">
                  <ArrowUpDown size={16} />
                  Sort
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="active-filter-banner">
                <span>
                  Filter aktif:{" "}
                  {activeTag && <strong>{FOLLOW_UP_TAG_LABELS[activeTag] ?? activeTag}</strong>}
                  {activeTag && activeGrades.length > 0 && " • "}
                  {activeGrades.length > 0 && <strong>Kelas {activeGrades.join(", ")}</strong>}{" "}
                  {activeDegrees.length > 0 && (activeTag || activeGrades.length > 0) && " • "}
                  {activeDegrees.length > 0 && <strong>{activeDegrees.join(", ")}</strong>}{" "}
                  ({filteredStudents.length})
                </span>
                <button type="button" onClick={() => setSearchParams({})}>
                  Hapus semua filter
                </button>
              </div>
            )}

            <label className="sso-students-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari nama, ID, atau paket..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </label>

            {selectedIds.size > 0 && (
              <div className="bulk-action-bar">
                <span className="bulk-action-count">{selectedIds.size} student dipilih</span>

                <div className="bulk-action-buttons">
                  <button type="button" className="outline-button bulk-action-button" onClick={openBulkComposer}>
                    <Send size={16} />
                    Kirim Reminder
                  </button>

                  <button type="button" className="outline-button bulk-action-button" onClick={handleBulkExport}>
                    <Download size={16} />
                    Export CSV
                  </button>

                  <button
                    type="button"
                    className="bulk-action-clear"
                    onClick={clearSelection}
                    aria-label="Batalkan pilihan"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <section className="sso-students-table-card">
              <table className="sso-students-table">
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        aria-label="Pilih semua student"
                      />
                    </th>
                    <th>Student</th>
                    <th>Kelas</th>
                    <th>Package</th>
                    <th>Package Name</th>
                    <th>Payment Date</th>
                    <th>Phone Number</th>
                    <th>More</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={selectedStudent?.id === student.id ? "selected-row" : ""}
                      onClick={() => setSelectedId(student.id)}
                    >
                      <td className="checkbox-cell" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                          aria-label={`Pilih ${student.name}`}
                        />
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
                      <td className="mono-cell">Kelas {student.grade}</td>
                      <td>{student.package}</td>
                      <td className="package-name-cell">{student.packageName}</td>
                      <td className="mono-cell">{student.paymentDate}</td>
                      <td className="mono-cell">{student.phoneNumber}</td>
                      <td>
                        <button
                          type="button"
                          className="text-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/sso/students/${student.id}`);
                          }}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredStudents.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={8}>Tidak ada student yang cocok dengan filter/pencarian.</td>
                    </tr>
                  )}
                  {loading && (
                    <tr className="empty-row">
                      <td colSpan={8}>Memuat data...</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <footer className="table-footer">
                <span>
                  Showing 1-{filteredStudents.length} of {students.length}
                </span>
                <div className="pagination">
                  <button type="button" disabled>Prev</button>
                  <button type="button" className="active-page">1</button>
                  <button type="button">2</button>
                  <span className="pagination-ellipsis">…</span>
                  <button type="button">59</button>
                  <button type="button">Next</button>
                </div>
              </footer>
            </section>
          </div>

          <aside className="sso-detail-column fade-in-up" style={{ "--delay": "100ms" }}>
            {selectedStudent && (
              <StudentDetailPanel
                key={selectedStudent.id}
                student={selectedStudent}
                onAddRecommendation={handleAddRecommendation}
                onRemoveRecommendation={handleRemoveRecommendation}
                navigate={navigate}
                handoverForStudent={handoverItems.filter((t) => t.studentId === selectedStudent.id)}
                onOpenComposer={openSingleComposer}
                universityOptions={universityApi.items}
                scholarshipOptions={scholarshipApi.items}
              />
            )}
          </aside>
        </section>
      </section>

      <MessageComposerModal
        open={composerOpen}
        previewStudent={
          composerContext?.type === "bulk"
            ? students.find((student) => selectedIds.has(student.id))
            : students.find((student) => student.id === composerContext?.studentId)
        }
        title={
          composerContext?.type === "bulk"
            ? `Kirim ke ${selectedIds.size} Student`
            : `Kirim ke SB — ${composerContext?.studentName ?? ""}`
        }
        subtitle={
          composerContext?.type === "bulk"
            ? "Pesan akan dipersonalisasi untuk tiap student dan diteruskan oleh Student Buddy."
            : "Tulis pesan yang akan diteruskan oleh Student Buddy kepada student ini."
        }
        onClose={() => {
          setComposerOpen(false);
          setComposerContext(null);
        }}
        onSend={handleComposerSend}
      />
    </main>
  );
}

function StudentDetailPanel({
  student,
  onAddRecommendation,
  onRemoveRecommendation,
  navigate,
  handoverForStudent,
  onOpenComposer,
  universityOptions,
  scholarshipOptions,
}) {
  const [activeTab, setActiveTab] = useState("kampus");
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const currentList = student.recommendations[activeTab];
  const searchPool = activeTab === "kampus" ? universityOptions : scholarshipOptions;

  const searchResults = searchPool.filter((option) => {
    const keyword = searchKeyword.toLowerCase();
    if (activeTab === "kampus") {
      return (
        option.university.toLowerCase().includes(keyword) ||
        option.program.toLowerCase().includes(keyword) ||
        option.country.toLowerCase().includes(keyword)
      );
    }
    return (
      option.name.toLowerCase().includes(keyword) ||
      option.provider.toLowerCase().includes(keyword)
    );
  });

  function handleSelectOption(option) {
    if (activeTab === "kampus") {
      onAddRecommendation(student.id, "kampus", {
        id: `kampus-${option.id}-${Date.now()}`,
        name: option.university,
        detail: `${option.country} - ${option.program}`,
      });
    } else {
      onAddRecommendation(student.id, "beasiswa", {
        id: `beasiswa-${option.id}-${Date.now()}`,
        name: option.name,
        detail: `${option.provider} - ${option.coverage}`,
      });
    }
    setSearchKeyword("");
    setAddFormOpen(false);
  }

  return (
    <section className="student-detail-card">
      <h2>{student.name}</h2>
      <p className="student-detail-id">
        {student.id} • Kelas {student.grade}
      </p>

      <div className="info-box">
        <span className="info-label">Package</span>
        <strong>{student.package}</strong>
      </div>
      <div className="info-box">
        <span className="info-label">Current Stage</span>
        <strong>{student.currentStage}</strong>
      </div>
      <div className="info-box">
        <span className="info-label">Next Deadline</span>
        <strong>{student.nextDeadline}</strong>
      </div>

      <div className="recommendation-section">
        <div className="recommendation-header">
          <h3>Rekomendasi</h3>
          <button
            type="button"
            className="icon-round-button"
            aria-label="Tambah rekomendasi"
            onClick={() => setAddFormOpen((open) => !open)}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="recommendation-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "kampus"}
            className={activeTab === "kampus" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("kampus")}
          >
            Kampus ({student.recommendations.kampus.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "beasiswa"}
            className={activeTab === "beasiswa" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("beasiswa")}
          >
            Beasiswa ({student.recommendations.beasiswa.length})
          </button>
        </div>

        {addFormOpen && (
          <div className="recommendation-search-form">
            <input
              type="text"
              placeholder={
                activeTab === "kampus"
                  ? "Cari universitas/program dari master data..."
                  : "Cari beasiswa dari master data..."
              }
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              autoFocus
            />

            <div className="recommendation-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="recommendation-search-item"
                    onClick={() => handleSelectOption(option)}
                  >
                    <strong>{activeTab === "kampus" ? option.university : option.name}</strong>
                    <span>
                      {activeTab === "kampus"
                        ? `${option.country} - ${option.program}`
                        : `${option.provider} - ${option.coverage}`}
                    </span>
                  </button>
                ))
              ) : (
                <p className="recommendation-search-empty">
                  Tidak ditemukan. Minta tim Academic menambahkan data ini.
                </p>
              )}
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setAddFormOpen(false);
                setSearchKeyword("");
              }}
            >
              Tutup
            </button>
          </div>
        )}

        <div className="recommendation-list">
          {currentList.length > 0 ? (
            currentList.map((item) => (
              <div key={item.id} className="recommendation-item">
                <div>
                  <strong>{item.name}</strong>
                  {item.detail && <span>{item.detail}</span>}
                </div>
                <button
                  type="button"
                  className="icon-remove-button"
                  aria-label={`Hapus ${item.name}`}
                  onClick={() => onRemoveRecommendation(student.id, activeTab, item.id)}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-recommendation-text">
              Belum ada rekomendasi {activeTab === "kampus" ? "kampus" : "beasiswa"}.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="outline-button view-full-detail-button"
        onClick={() => navigate(`/sso/students/${student.id}`)}
      >
        Lihat Detail Lengkap
      </button>

      {handoverForStudent.length > 0 && (
        <div className="handover-history-section">
          <span className="section-label">Riwayat Handover</span>
          <div className="handover-history-list">
            {handoverForStudent.map((item) => (
              <div key={item.id} className="handover-history-item">
                <p>{item.message}</p>
                <span className={`handover-history-status status-${item.status}`}>
                  {item.status === "done" ? "Selesai" : "Belum"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="outline-button send-composer-button"
        onClick={() => onOpenComposer(student.id, student.name)}
      >
        <Send size={16} />
        Tulis Pesan
      </button>
    </section>
  );
}

function getInitials(name) {
  if (!name) return "JK";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
