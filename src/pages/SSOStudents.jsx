import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowUpDown,
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
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { mockSsoStudents } from "../data/mockSsoStudents";
import "./StudentBuddyDashboard.css";
import "./SSOStudents.css";

const RECIPIENT_OPTIONS = [
  { value: "SB", label: "Student Buddy" },
  { value: "HL", label: "Hotline" },
  { value: "RN", label: "Rania" },
];

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function SSOStudents({ user, onLogout }) {
  const [students, setStudents] = useState(mockSsoStudents);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(mockSsoStudents[0]?.id ?? null);

  const filteredStudents = students.filter((student) => {
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
                <button type="button" className="outline-button small-toolbar-button">
                  <Filter size={16} />
                  Filter
                </button>
                <button type="button" className="outline-button small-toolbar-button">
                  <ArrowUpDown size={16} />
                  Sort
                </button>
              </div>
            </div>

            <label className="sso-students-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari nama, ID, atau paket..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </label>

            <section className="sso-students-table-card">
              <table className="sso-students-table">
                <thead>
                  <tr>
                    <th>Student</th>
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
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
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
                            setSelectedId(student.id);
                          }}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={6}>Tidak ada student yang cocok dengan pencarian.</td>
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
              />
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function StudentDetailPanel({ student, onAddRecommendation, onRemoveRecommendation }) {
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

    // Placeholder: belum terhubung ke backend/chat sungguhan.
    setMessageText("");
  }

  return (
    <section className="student-detail-card">
      <h2>{student.name}</h2>
      <p className="student-detail-id">{student.id}</p>

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