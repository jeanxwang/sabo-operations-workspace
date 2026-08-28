import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowUpDown,
  Filter,
  Grid2X2,
  List,
  LogOut,
  Plus,
  Search,
  Send,
  Ticket,
  User,
  Users,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { mockTickets } from "../data/mockTickets";
import "./StudentBuddyDashboard.css";
import "./StudentBuddyTickets.css";

const STATUS_LABEL = {
  belum: "Belum",
  proses: "Proses",
  done: "Done",
};

function navLinkClass({ isActive }) {
  return isActive ? "sidebar-link active" : "sidebar-link";
}

export default function StudentBuddyTickets({ user, onLogout }) {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(mockTickets[0]?.id ?? null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(keyword) ||
      ticket.subject.toLowerCase().includes(keyword) ||
      ticket.studentName.toLowerCase().includes(keyword)
    );
  });

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0];

  function handleStatusChange(ticketId, nextStatus) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket
      )
    );
  }

  function handleSelectTicket(ticketId) {
    setSelectedId(ticketId);
    setReplyOpen(false);
    setReplyText("");
  }

  function handleSubmitReply(event) {
    event.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              log: [
                ...ticket.log,
                { title: replyText.trim(), by: user?.name || "Eom Sean", time: "Baru saja" },
              ],
            }
          : ticket
      )
    );
    setReplyText("");
    setReplyOpen(false);
  }

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

          <NavLink to="/student-buddy/tickets" className={navLinkClass}>
            <Ticket size={22} />
            <span>Tickets</span>
          </NavLink>
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
            <strong>Tickets</strong>
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

        <section className="tickets-content">
          <div className="tickets-main-column fade-in-up" style={{ "--delay": "0ms" }}>
            <div className="tickets-header-row">
              <h1>Daftar Tiket ({tickets.length})</h1>

              <div className="tickets-toolbar-actions">
                <button type="button" className="outline-button small-toolbar-button">
                  <Filter size={16} />
                  Filter
                </button>
                <button type="button" className="outline-button small-toolbar-button">
                  <ArrowUpDown size={16} />
                  Sort
                </button>
                <button type="button" className="outline-button create-ticket-button">
                  <Plus size={18} />
                  Buat tiket
                </button>
              </div>
            </div>

            <label className="tickets-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari ID, subjek, atau nama student..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
            </label>

            <section className="tickets-table-card">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Student</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={selectedTicket?.id === ticket.id ? "selected-row" : ""}
                      onClick={() => handleSelectTicket(ticket.id)}
                    >
                      <td className="ticket-id-cell">{ticket.id}</td>
                      <td>
                        <strong>{ticket.subject}</strong>
                      </td>
                      <td>{ticket.studentName}</td>
                      <td>
                        <StatusSelect
                          status={ticket.status}
                          onChange={(next) => handleStatusChange(ticket.id, next)}
                        />
                      </td>
                    </tr>
                  ))}

                  {filteredTickets.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={4}>Tidak ada tiket yang cocok dengan pencarian.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <footer className="table-footer">
                <span>
                  Showing 1-{filteredTickets.length} of {tickets.length}
                </span>
                <div className="pagination">
                  <button type="button" disabled>
                    Prev
                  </button>
                  <button type="button" className="active-page">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">Next</button>
                </div>
              </footer>
            </section>
          </div>

          <aside className="ticket-detail-column fade-in-up" style={{ "--delay": "100ms" }}>
            {selectedTicket ? (
              <section className="ticket-detail-card">
                <span className="ticket-id-badge">{selectedTicket.id}</span>

                <h2>{selectedTicket.subject}</h2>

                <div className="ticket-student-row">
                  <User size={18} />
                  <span>
                    {selectedTicket.studentName} ({selectedTicket.studentId})
                  </span>
                </div>

                <div className="ticket-detail-section">
                  <span className="section-label">Deskripsi Isu</span>
                  <p>{selectedTicket.description}</p>
                </div>

                <div className="ticket-detail-section ticket-log-section">
                  <span className="section-label">Tindak Lanjut &amp; Log</span>

                  <ol className="ticket-log-list">
                    {selectedTicket.log.map((entry, index) => (
                      <li key={`${entry.title}-${index}`} className="ticket-log-item">
                        <User size={16} />
                        <div>
                          <p>{entry.title}</p>
                          <span>
                            Oleh: {entry.by} • {entry.time}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="ticket-detail-footer">
                  {replyOpen && (
                    <form className="reply-form" onSubmit={handleSubmitReply}>
                      <textarea
                        rows={3}
                        placeholder="Tulis tindak lanjut atau catatan..."
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value)}
                        autoFocus
                      />
                      <div className="reply-form-actions">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => {
                            setReplyOpen(false);
                            setReplyText("");
                          }}
                        >
                          Batal
                        </button>
                        <button type="submit" className="outline-button" disabled={!replyText.trim()}>
                          Kirim
                        </button>
                      </div>
                    </form>
                  )}

                  {!replyOpen && (
                    <button
                      type="button"
                      className="outline-button respond-ticket-button"
                      onClick={() => setReplyOpen(true)}
                    >
                      <Send size={18} />
                      Respon tiket
                    </button>
                  )}
                </div>
              </section>
            ) : (
              <section className="ticket-detail-card ticket-detail-empty">
                <p>Pilih salah satu tiket untuk melihat detail.</p>
              </section>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function StatusSelect({ status, onChange }) {
  return (
    <div className={`status-select status-${status}`}>
      <span className="status-dot" aria-hidden="true"></span>
      <select value={status} onChange={(event) => onChange(event.target.value)}>
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
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