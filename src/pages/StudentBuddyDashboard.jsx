import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Grid2X2,
  Users,
  Ticket,
  Plus,
  List,
  LogOut,
  Send,
  ClipboardList,
} from "lucide-react";
import "./StudentBuddyDashboard.css";
import schotersLogo from "../assets/schoters-logo.png";

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let frameId;

    function tick(timestamp) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

const TASKS = [
  {
    id: "new-student",
    title: "Student Baru",
    count: 1,
    urgency: "low",
    icon: Send,
    label: "Greet student baru",
  },
  {
    id: "not-activated",
    title: "Student Belum Aktivasi",
    count: 3,
    urgency: "medium",
    icon: ClipboardList,
    label: "Guide aktivasi",
  },
  {
    id: "tickets",
    title: "Tiket Perlu Ditangani",
    count: 5,
    urgency: "high",
    icon: Ticket,
    label: "Lihat tiket",
  },
];

export default function StudentBuddyDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);
  const initials = getInitials(user?.name);
  const totalStudents = useCountUp(49);

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
            <NavLink
                to="/student-buddy/dashboard"
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
            >
                <Grid2X2 size={22} />
                <span>Dashboard</span>
            </NavLink>

            <NavLink
                to="/student-buddy/students"
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
            >
                <Users size={22} />
                <span>Students</span>
            </NavLink>

          <a href="#" className="sidebar-link">
            <Ticket size={22} />
            <span>Tickets</span>
          </a>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{initials}</span>
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
            <strong>Student Buddy</strong>
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

        <section className="dashboard-content">
          <div className="dashboard-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <h1>Welcome back, {displayName}!</h1>

            <button type="button" className="outline-button create-ticket-button">
              <Plus size={20} />
              Buat tiket
            </button>
          </div>

          <section
            className="student-summary fade-in-up"
            style={{ "--delay": "80ms" }}
            aria-label="Total student aktif"
          >
            <h2>Total Student Aktif</h2>
            <p>yang sedang dipegang oleh {displayName} sebagai Student Buddy</p>
            <strong className="summary-count">{totalStudents}</strong>

            <button
                type="button"
                className="outline-button view-students-button"
                onClick={() => navigate("/student-buddy/students")}
            >
                <Users size={20} />
                Lihat semua student
            </button>
          </section>

          <section className="today-section fade-in-up" style={{ "--delay": "140ms" }}>
            <h2>Tugas Hari Ini</h2>

            <div className="task-grid">
              {TASKS.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function TaskCard({ task, index }) {
  const Icon = task.icon;
  const count = useCountUp(task.count, 700);

  return (
    <article
      className="task-card fade-in-up"
      style={{ "--delay": `${180 + index * 70}ms` }}
      data-urgency={task.urgency}
    >
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <span className="urgency-dot" aria-hidden="true"></span>
      </div>

      <strong>{count}</strong>

      <button type="button" className="outline-button task-button">
        <Icon size={20} />
        {task.label}
      </button>
    </article>
  );
}

function getDisplayName(name) {
  if (!name) return "Sean";

  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
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