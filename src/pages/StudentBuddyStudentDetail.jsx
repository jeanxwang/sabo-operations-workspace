import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Grid2X2,
  LogOut,
  MessageCircle,
  Plus,
  Tag,
  Ticket,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import { useStudents } from "../hooks/useStudents";
import { mockStudents as mockStudentExtras } from "../data/mockStudents";
import { mergeStudentExtras } from "../utils/mergeStudentExtras";
import { useHandoverStore } from "../hooks/useHandoverStore";
import { mockHandoverSeed } from "../data/mockHandover";
import "./StudentBuddyDashboard.css";
import "./StudentBuddyStudentDetail.css";
import TopbarActions from "../components/TopbarActions";

function navLinkClass({ isActive }) {
  return isActive ? "sidebar-link active" : "sidebar-link";
}

const TABS = [
  { id: "profil", label: "Profil" },
  { id: "checklist", label: "Checklist Pre-Bimbingan" },
  { id: "activity", label: "Recent Activity" },
  { id: "handover", label: "Handover dari SSO" },
];

export default function StudentBuddyStudentDetail({ user, onLogout }) {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");

  const { items: apiStudents, loading } = useStudents();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!loading && apiStudents.length > 0) {
      const merged = mergeStudentExtras(apiStudents, mockStudentExtras, ["actionDone", "recentActivity"]);
      setStudent(merged.find((s) => s.id === studentId) ?? null);
    }
  }, [loading, apiStudents, studentId]);

  const { items: handoverItems, updateStatus } = useHandoverStore(mockHandoverSeed);
  const handoverForStudent = handoverItems.filter((item) => item.studentId === studentId);

  if (loading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-main">
          <div className="sb-detail-not-found">
            <p>Memuat data...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-main">
          <div className="sb-detail-not-found">
            <p>Student tidak ditemukan.</p>
            <button
              type="button"
              className="outline-button"
              onClick={() => navigate("/student-buddy/students")}
            >
              <ArrowLeft size={18} />
              Kembali ke daftar student
            </button>
          </div>
        </section>
      </main>
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
          <NavLink to="/student-buddy/handover" className={navLinkClass}>
            <CheckCircle2 size={22} />
            <span>Handover</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span>
            <strong>{user?.name || "Eom Sean"}</strong>
            <small>CX - Student Buddy</small>
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
            <NavLink to="/student-buddy/students" className="breadcrumb-link">
              Students
            </NavLink>
            <span className="breadcrumb-separator">›</span>
            <strong>{student.name}</strong>
          </div>

          <TopbarActions />
        </header>

        <div className="sb-detail-page-header fade-in-up" style={{ "--delay": "0ms" }}>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/student-buddy/students")}
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          <div className="sb-detail-page-title">
            <h1>{student.name}</h1>
            <span className="sb-detail-page-id">{student.id}</span>
            <span className="sb-detail-page-badge">{student.package}</span>
          </div>
        </div>

        <nav className="detail-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "detail-tab active" : "detail-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "handover" && handoverForStudent.length > 0 && (
                <span className="detail-tab-count">{handoverForStudent.length}</span>
              )}
            </button>
          ))}
        </nav>

        <section className="detail-tab-panel fade-in-up" style={{ "--delay": "60ms" }}>
          {activeTab === "profil" && <ProfilTab student={student} />}
          {activeTab === "checklist" && <ChecklistTab student={student} />}
          {activeTab === "activity" && <ActivityTab student={student} />}
          {activeTab === "handover" && (
            <HandoverTab items={handoverForStudent} onUpdateStatus={updateStatus} />
          )}
        </section>
      </section>
    </main>
  );
}

function ProfilTab({ student }) {
  return (
    <div className="sb-detail-field-grid">
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Nama</span>
        <span className="sb-detail-field-value">{student.name}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Student ID</span>
        <span className="sb-detail-field-value">{student.id}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Package</span>
        <span className="sb-detail-field-value">{student.package}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Action</span>
        <span className="sb-detail-field-value">{student.action}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Kelas</span>
        <span className="sb-detail-field-value">{student.grade ?? "—"}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Jenjang</span>
        <span className="sb-detail-field-value">{student.currentDegree ?? "—"}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Current Stage</span>
        <span className="sb-detail-field-value">{student.currentStage ?? "—"}</span>
      </div>
      <div className="sb-detail-field">
        <span className="sb-detail-field-label">Next Deadline</span>
        <span className="sb-detail-field-value">{student.nextDeadline ?? "—"}</span>
      </div>
    </div>
  );
}

function ChecklistTab({ student }) {
  return (
    <div className="sb-checklist-section">
      <span className="sb-checklist-label">Action Done</span>

      <div className="sb-checklist-chip-row">
        {student.actionDone.length > 0 ? (
          student.actionDone.map((action) => (
            <span key={action} className="sb-done-chip">
              {action}
              <X size={14} />
            </span>
          ))
        ) : (
          <p className="sb-checklist-empty">Belum ada action selesai.</p>
        )}

        <button type="button" className="sb-add-action-chip">
          Tambah
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function ActivityTab({ student }) {
  return (
    <div className="sb-activity-list">
      {student.recentActivity.length > 0 ? (
        student.recentActivity.map((activity) => (
          <article key={activity.title} className="sb-activity-item">
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
        <p className="sb-checklist-empty">Belum ada aktivitas terbaru.</p>
      )}
    </div>
  );
}

function HandoverTab({ items, onUpdateStatus }) {
  if (items.length === 0) {
    return <p className="sb-checklist-empty">Belum ada handover dari SSO untuk student ini.</p>;
  }

  return (
    <div className="sb-handover-list">
      {items.map((item) => (
        <article key={item.id} className="sb-handover-card" data-status={item.status}>
          <div className="sb-handover-top">
            <span className={`sb-handover-status status-${item.status}`}>
              {item.status === "done" ? "Selesai" : "Belum"}
            </span>
            <span className="sb-handover-meta">
              Dari: {item.fromSso} • {item.createdAt}
            </span>
          </div>

          <p className="sb-handover-message">{item.message}</p>

          {item.status === "belum" && (
            <button
              type="button"
              className="outline-button sb-handover-done-button"
              onClick={() => onUpdateStatus(item.id, "done")}
            >
              <CheckCircle2 size={16} />
              Tandai Selesai
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

function getInitials(name) {
  if (!name) return "ES";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
