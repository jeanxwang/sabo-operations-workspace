import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Download,
  Filter,
  Grid2X2,
  List,
  LogOut,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { mockSsoStudents } from "../data/mockSsoStudents";
import "./StudentBuddyDashboard.css";
import "./SSOStudents.css";
import { useHandoverStore } from "../hooks/useHandoverStore";
import { mockHandoverSeed } from "../data/mockHandover";
import { useSearchParams } from "react-router-dom";
import { FOLLOW_UP_TAG_LABELS } from "../data/followUpTags";

const RECIPIENT_OPTIONS = [
  { value: "SB", label: "Student Buddy" },
  { value: "HL", label: "Hotline" },
  { value: "RN", label: "Rania" },
];

const GRADE_OPTIONS = ["10", "11", "12"];

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

function downloadCsv(students) {
  const headers = ["Nama", "ID", "Kelas", "Package", "Payment Date", "Phone Number"];
  const rows = students.map((s) => [
    s.name,
    s.id,
    s.grade,
    s.package,
    s.paymentDate,
    s.phoneNumber,
  ]);

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
  const [students, setStudents] = useState(mockSsoStudents);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(mockSsoStudents[0]?.id ?? null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [reminderText, setReminderText] = useState("");

  const activeTag = searchParams.get("tag");
  const activeGrades = (searchParams.get("grade") ?? "")
    .split(",")
    .filter(Boolean);

  const { items: handoverItems, addHandover } = useHandoverStore(mockHandoverSeed);

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
      (student) =>
        activeGrades.length === 0 || activeGrades.includes(String(student.grade))
    )
    .filter((student) => {
      const keyword = searchKeyword.toLowerCase();
      return (
        student.name.toLowerCase().includes(keyword) ||
        student.id.toLowerCase().includes(keyword) ||
        student.package.toLowerCase().includes(keyword) ||
        student.packageName.toLowerCase().includes(keyword)
      );
    });

  const selectedStudent =
    students.find((student) => student.id === selectedId) ?? students[0];

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selectedIds.has(student.id));

  function toggleGrade(grade) {
    const next = new URLSearchParams(searchParams);
    const current = new Set(activeGrades);

    if (current.has(grade)) {
      current.delete(grade);
    } else {
      current.add(grade);
    }

    if (current.size === 0) {
      next.delete("grade");
    } else {
      next.set("grade", Array.from(current).join(","));
    }
    setSearchParams(next);
  }

  function clearGradeFilter() {
    const next = new URLSearchParams(searchParams);
    next.delete("grade");
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
                [category]: student.recommendations[category].filter(
                  (item) => item.id !== itemId
                ),
              },
            }
          : student
      )
    );
  }

  function toggleSelectStudent(studentId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        filteredStudents.forEach((student) => next.delete(student.id));
        return next;
      }
      const next = new Set(prev);
      filteredStudents.forEach((student) => next.add(student.id));
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setReminderFormOpen(false);
    setReminderText("");
  }

  function handleBulkReminderSubmit(event) {
    event.preventDefault();
    if (!reminderText.trim()) return;

    const targets = students.filter((student) => selectedIds.has(student.id));
    targets.forEach((student) => {
      addHandover({
        id: `TTP-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        fromSso: user?.name || "Jung Kook",
        toSb: "Student Buddy",
        message: reminderText.trim(),
        status: "belum",
        createdAt: "Baru saja",
      });
    });

    setReminderText("");
    setReminderFormOpen(false);
    clearSelection();
  }

  function handleBulkExport() {
    const targets = students.filter((student) => selectedIds.has(student.id));
    downloadCsv(targets);
  }

  const hasActiveFilters = activeTag || activeGrades.length > 0;

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

          <div className="topbar-actions">
            <button type="button" aria-label="Menu">
              <List size={22} />
            </button>

            <button type="button" aria-label="Logout" onClick={onLogout}>
              <LogOut size={22} />
            </button>
          </div>
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
                    {activeGrades.length > 0 && (
                      <span className="filter-count-badge">{activeGrades.length}</span>
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

                      {activeGrades.length > 0 && (
                        <button
                          type="button"
                          className="text-button filter-popover-reset"
                          onClick={clearGradeFilter}
                        >
                          Reset filter kelas
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
                  {activeTag && (
                    <strong>{FOLLOW_UP_TAG_LABELS[activeTag] ?? activeTag}</strong>
                  )}
                  {activeTag && activeGrades.length > 0 && " • "}
                  {activeGrades.length > 0 && (
                    <strong>Kelas {activeGrades.join(", ")}</strong>
                  )}{" "}
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
                {!reminderFormOpen ? (
                  <>
                    <span className="bulk-action-count">
                      {selectedIds.size} student dipilih
                    </span>

                    <div className="bulk-action-buttons">
                      <button
                        type="button"
                        className="outline-button bulk-action-button"
                        onClick={() => setReminderFormOpen(true)}
                      >
                        <Send size={16} />
                        Kirim Reminder ke SB
                      </button>

                      <button
                        type="button"
                        className="outline-button bulk-action-button"
                        onClick={handleBulkExport}
                      >
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
                  </>
                ) : (
                  <form className="bulk-reminder-form" onSubmit={handleBulkReminderSubmit}>
                    <input
                      type="text"
                      placeholder={`Tulis reminder untuk ${selectedIds.size} student...`}
                      value={reminderText}
                      onChange={(event) => setReminderText(event.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setReminderFormOpen(false);
                        setReminderText("");
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="outline-button bulk-action-button"
                      disabled={!reminderText.trim()}
                    >
                      Kirim ke {selectedIds.size} SB
                    </button>
                  </form>
                )}
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
                      <td
                        className="checkbox-cell"
                        onClick={(event) => event.stopPropagation()}
                      >
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

                  {filteredStudents.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={8}>Tidak ada student yang cocok dengan filter/pencarian.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <footer className="table-footer">
                <span>
                  Showing 1-{filteredStudents.length} of {students.length}
                </span>
                <div className="pagination">
                  <button type="button" disabled>
                    Prev
                  </button>
                  <button type="button" className="active-page">
                    1
                  </button>
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
                ssoName={user?.name || "Jung Kook"}
                handoverForStudent={handoverItems.filter((t) => t.studentId === selectedStudent.id)}
                onSendHandover={addHandover}
              />
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function StudentDetailPanel({ student, onAddRecommendation, onRemoveRecommendation, navigate, ssoName, handoverForStudent, onSendHandover }) {
  const [activeTab, setActiveTab] = useState("kampus");
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [detailInput, setDetailInput] = useState("");
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState("SB");

  const currentList = student.recommendations[activeTab];

  function handleAddSubmit(event) {
    event.preventDefault();
    if (!nameInput.trim()) return;

    onAddRecommendation(student.id, activeTab, {
      id: `${activeTab}-${Date.now()}`,
      name: nameInput.trim(),
      detail: detailInput.trim(),
    });

    setNameInput("");
    setDetailInput("");
    setAddFormOpen(false);
  }

  function handleSendMessage(event) {
    event.preventDefault();
    if (!messageText.trim()) return;

    if (recipient === "SB") {
      onSendHandover({
        id: `TTP-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        fromSso: ssoName,
        toSb: "Student Buddy",
        message: messageText.trim(),
        status: "belum",
        createdAt: "Baru saja",
      });
    }

    setMessageText("");
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
          <form className="add-recommendation-form" onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder={activeTab === "kampus" ? "Nama kampus" : "Nama beasiswa"}
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              autoFocus
            />
            <input
              type="text"
              placeholder="Detail (negara, program, dsb.)"
              value={detailInput}
              onChange={(event) => setDetailInput(event.target.value)}
            />
            <div className="add-recommendation-actions">
              <button
                type="button"
                className="text-button"
                onClick={() => setAddFormOpen(false)}
              >
                Batal
              </button>
              <button type="submit" className="outline-button" disabled={!nameInput.trim()}>
                Tambah
              </button>
            </div>
          </form>
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
          <span className="section-label">Riwayat Handover ke SB</span>
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

      <form className="send-message-row" onSubmit={handleSendMessage}>
        <label className="send-message-input">
          <MessageCircle size={18} />
          <input
            type="text"
            placeholder="Kirim pesan..."
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
          />
        </label>

        <label className="send-message-recipient">
          <span>To:</span>
          <select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
            {RECIPIENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="send-message-button" aria-label="Kirim pesan">
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

function getInitials(name) {
  if (!name) return "JK";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}