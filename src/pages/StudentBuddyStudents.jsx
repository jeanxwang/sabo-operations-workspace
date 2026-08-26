import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowUpDown,
  ChevronRight,
  Clock,
  Filter,
  Grid2X2,
  List,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Tag,
  Ticket,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { mockStudents } from "../data/mockStudents";
import "./StudentBuddyDashboard.css";
import "./StudentBuddyStudents.css";

function navLinkClass({ isActive }) {
  return isActive ? "sidebar-link active" : "sidebar-link";
}

export default function StudentBuddyStudents({ user, onLogout }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  const filteredStudents = mockStudents.filter((student) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      student.name.toLowerCase().includes(keyword) ||
      student.id.toLowerCase().includes(keyword) ||
      student.package.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/student-buddy/dashboard" className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/student-buddy/students" className={navLinkClass}>
            <Users size={22} />
            <span>Students</span>
          </NavLink>

          <a href="#" className="sidebar-link">
            <Ticket size={22} />
            <span>Tickets</span>
          </a>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Eom Sean"}</strong>
            <small>CX - Student Buddy</small>
          </span>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>SABO Operations</span>
            <span className="breadcrumb-separator">›</span>
            <span>Student Buddy</span>
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

        <section className="students-content">
          <div className="students-main-column fade-in-up" style={{ "--delay": "0ms" }}>
            <div className="students-header-row">
              <h1>Student Aktif ({mockStudents.length})</h1>

              <div className="students-toolbar-actions">
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

            <label className="students-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari nama, ID, atau paket..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </label>

            <section className="students-table-card">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Package</th>
                    <th>Action</th>
                    <th>More</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={
                        selectedStudent.id === student.id ? "selected-row" : ""
                      }
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
                      <td>{student.package}</td>
                      <td>
                        <button type="button" className="row-action-button">
                          {student.action}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="text-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedStudent(student);
                          }}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={4}>Tidak ada student yang cocok dengan pencarian.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <footer className="table-footer">
                <span>
                  Showing 1-{filteredStudents.length} of {mockStudents.length}
                </span>
                <div className="pagination">
                  <button type="button" disabled>
                    Prev
                  </button>
                  <button type="button" className="active-page">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">Next</button>
                </div>
              </footer>
            </section>
          </div>

          <aside className="students-side-column">
            <section
              className="student-detail-card fade-in-up"
              style={{ "--delay": "80ms" }}
            >
              <h2>{selectedStudent.name}</h2>
              <p>{selectedStudent.id}</p>

              <div className="detail-block">
                <span>Package</span>
                <strong>{selectedStudent.package}</strong>
              </div>

              <div className="detail-block">
                <span>Action Done</span>
                <div className="action-chip-row">
                  {selectedStudent.actionDone.length > 0 ? (
                    selectedStudent.actionDone.map((action) => (
                      <button key={action} type="button" className="done-chip">
                        {action}
                        <X size={14} />
                      </button>
                    ))
                  ) : (
                    <p className="empty-action-text">Belum ada action selesai</p>
                  )}
                  <button type="button" className="add-action-chip">
                    Tambah
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button type="button" className="outline-button create-ticket-detail-button">
                <Plus size={18} />
                Buat tiket
              </button>
            </section>

            <section
              className="recent-activity-card fade-in-up"
              style={{ "--delay": "140ms" }}
            >
              <h2>Recent Activity</h2>

              <div className="activity-list">
                {selectedStudent.recentActivity.length > 0 ? (
                  selectedStudent.recentActivity.map((activity) => (
                    <article key={activity.title} className="activity-item">
                      {activity.type === "group" ? (
                        <MessageCircle size={20} />
                      ) : (
                        <Tag size={20} />
                      )}
                      <div>
                        <p>{activity.title}</p>
                        <span>
                          <Clock size={13} />
                          {activity.time}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="empty-activity-text">Belum ada aktivitas terbaru.</p>
                )}
              </div>

              <button type="button" className="outline-button view-all-activity-button">
                Lihat Semua Aktivitas
                <ChevronRight size={18} />
              </button>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

function getInitials(name) {
  if (!name) return "ES";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}