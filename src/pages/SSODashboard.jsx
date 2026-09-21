import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Grid2X2,
  Users,
  LogOut,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { mockSsoDashboard } from "../data/mockSsoDashboard";
import { FOLLOW_UP_TAG_LABELS } from "../data/followUpTags";
import "./StudentBuddyDashboard.css";
import "./SSODashboard.css";
import schotersLogo from "../assets/schoters-logo.png";
import { useStudents } from "../hooks/useStudents";
import TopbarActions from "../components/TopbarActions";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

function getStatusLevel(status) {
  if (status === "high-risk") return "high";
  if (status === "on-track") return "low";
  return "neutral";
}

export default function SSODashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const displayName = getDisplayName(user?.name);
  const initials = getInitials(user?.name);

  const { followUp, cxUpdate, priorities, updates } = mockSsoDashboard;
  const { items: students } = useStudents();
  const totalStudentValue = students.length > 0 ? students.length : mockSsoDashboard.totalActiveStudents;
  const totalStudents = useCountUp(totalStudentValue);
  const grade12Students = students.filter((student) => student.grade === 12);
  const grade12Preview = grade12Students.slice(0, 4);
  const [activeDistribution, setActiveDistribution] = useState(null);
  const distributionGroups = buildDistributionGroups(students, mockSsoDashboard.distribution);
  const activeDistributionItem = getActiveDistributionItem(
    distributionGroups,
    activeDistribution
  );

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
          <span className="profile-avatar">{initials}</span>
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
            <strong>SSO</strong>
          </div>

          <TopbarActions />
        </header>

        <section className="dashboard-content">
          <div className="dashboard-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <h1>Welcome back, {displayName}!</h1>

            <button type="button" className="outline-button update-progress-button">
              <RefreshCcw size={18} />
              Update progress student
            </button>
          </div>

          <section
            className="student-summary fade-in-up"
            style={{ "--delay": "80ms" }}
            aria-label="Total student aktif"
          >
            <h2>Total Student Aktif</h2>
            <p>yang sedang dipegang oleh {displayName} sebagai SSO</p>
            <strong className="summary-count">{totalStudents}</strong>

            <button
              type="button"
              className="outline-button view-students-button"
              onClick={() => navigate("/sso/students")}
            >
              <Users size={20} />
              Lihat semua student
            </button>
          </section>

          <section className="sso-highlight-section fade-in-up" style={{ "--delay": "140ms" }}>
            <h2>Highlight</h2>

            <div className="sso-highlight-grid">
              <FollowUpCard followUp={followUp} navigate={navigate} />
              <HighlightCard item={cxUpdate} index={1} />
            </div>
          </section>

          <section className="sso-distribution-section fade-in-up" style={{ "--delay": "160ms" }}>
            <header className="sso-distribution-header">
              <div>
                <h2>Pembagian Student</h2>
                <p>Hover atau fokus pada bar untuk melihat jumlah dan persentase tiap kelompok.</p>
              </div>
              <span className="sso-distribution-total">
                {formatNumber(distributionGroups[0].total)} student terpetakan
              </span>
            </header>

            <div className="sso-distribution-layout">
              <div className="sso-distribution-chart" aria-label="Chart pembagian student">
                {distributionGroups.map((group) => (
                  <DistributionGroup
                    key={group.id}
                    group={group}
                    activeKey={activeDistribution?.key}
                    onFocusItem={setActiveDistribution}
                    onSelectItem={(item) => {
                      if (item.value) {
                        navigate(`/sso/students?${group.id === "grades" ? "grade" : "degree"}=${encodeURIComponent(item.value)}`);
                      }
                    }}
                  />
                ))}
              </div>

              <DistributionDetail item={activeDistributionItem} />
            </div>
          </section>

          <section className="sso-grade12-section fade-in-up" style={{ "--delay": "180ms" }}>
            <div className="grade12-card">
              <header className="grade12-header">
                <div>
                  <h2>Fokus Kelas 12</h2>
                  <p>{grade12Students.length} student sedang di tahap krusial menjelang deadline aplikasi.</p>
                </div>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => navigate("/sso/students?grade=12")}
                >
                  Lihat Selengkapnya
                  <ChevronRight size={18} />
                </button>
              </header>

              <table className="grade12-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Stage</th>
                    <th>Next Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {grade12Preview.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
                      <td>{student.currentStage}</td>
                      <td className="mono-cell">{student.nextDeadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sso-priority-section fade-in-up" style={{ "--delay": "220ms" }}>
            <div className="priority-table-card">
              <header className="priority-table-header">
                <h2>Student perlu diperhatikan</h2>
                <span className="priority-sort-note">urgent first</span>
              </header>

              <table className="priority-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Stage</th>
                    <th>Issue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {priorities.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                        <span>{student.id}</span>
                      </td>
                      <td>{student.stage}</td>
                      <td>{student.issue}</td>
                      <td>
                        <span className={`status-badge status-${getStatusLevel(student.status)}`}>
                          {student.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sso-updates-section fade-in-up" style={{ "--delay": "280ms" }}>
            <div className="cx-updates-card">
              <h2>Update dari CX/Lainnya</h2>

              <div className="cx-updates-list">
                {updates.map((update) => (
                  <article key={update.id} className="cx-update-item">
                    <strong>{update.studentName}</strong>
                    <p>{update.message}</p>
                    <span>{update.time}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function FollowUpCard({ followUp, navigate }) {
  const total = useCountUp(followUp.total);

  return (
    <article className="sso-highlight-card follow-up-card">
      <h3>Perlu Follow Up</h3>
      <strong>{total}</strong>

      <div className="follow-up-breakdown">
        {followUp.items.map((item) => (
          <FollowUpRow
            key={item.id}
            item={item}
            onView={() => navigate(`/sso/students?tag=${item.id}`)}
          />
        ))}
      </div>
    </article>
  );
}

function FollowUpRow({ item, onView }) {
  const count = useCountUp(item.count, 600);

  return (
    <div className="follow-up-row">
      <div className="follow-up-row-info">
        <span className="follow-up-row-count">{count}</span>
        <span className="follow-up-row-label">{FOLLOW_UP_TAG_LABELS[item.id]}</span>
      </div>

      <button type="button" className="follow-up-row-action" onClick={onView}>
        Lihat
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function HighlightCard({ item, index }) {
  const count = useCountUp(item.count, 700);

  return (
    <article className="sso-highlight-card" style={{ "--delay": `${180 + index * 60}ms` }}>
      <h3>{item.title}</h3>
      <strong>{count}</strong>

      {item.description && <p>{item.description}</p>}

      {item.action && (
        <button type="button" className="outline-button highlight-action-button">
          <MessageCircle size={18} />
          {item.action}
        </button>
      )}
    </article>
  );
}

function buildDistributionGroups(students, fallback) {
  const source = students.length > 0 ? students : null;
  const total = source ? source.length : fallback.totalActiveStudents;

  function createGroup(id, title, description, definitions, getValue, fallbackItems) {
    const items = definitions.map((definition) => {
      const count = source
        ? source.filter((student) => String(getValue(student)) === definition.value).length
        : fallbackItems.find((item) => item.label === definition.label)?.count ?? 0;

      return {
        key: `${id}-${definition.value}`,
        label: definition.label,
        value: definition.value,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });

    const knownCount = items.reduce((sum, item) => sum + item.count, 0);
    if (source && total > knownCount) {
      const missingCount = total - knownCount;
      items.push({
        key: `${id}-missing`,
        label: "Belum diisi",
        value: "",
        count: missingCount,
        percentage: (missingCount / total) * 100,
      });
    }

    return { id, title, description, total, items };
  }

  return [
    createGroup(
      "grades",
      "Berdasarkan Kelas",
      "Distribusi student jenjang SMA",
      [
        { label: "Kelas 10", value: "10" },
        { label: "Kelas 11", value: "11" },
        { label: "Kelas 12", value: "12" },
      ],
      (student) => student.grade,
      fallback.grades
    ),
    createGroup(
      "degrees",
      "Berdasarkan Jenjang",
      "Distribusi jenjang pendidikan saat ini",
      [
        { label: "S1", value: "S1" },
        { label: "S2", value: "S2" },
        { label: "S3", value: "S3" },
        { label: "Gap Year", value: "Gap Year" },
      ],
      (student) => student.currentDegree,
      fallback.degrees
    ),
  ];
}

function getActiveDistributionItem(groups, active) {
  const allItems = groups.flatMap((group) => group.items);
  return allItems.find((item) => item.key === active?.key) ?? allItems[0] ?? null;
}

function DistributionGroup({ group, activeKey, onFocusItem, onSelectItem }) {
  return (
    <section className="sso-distribution-group" aria-labelledby={`${group.id}-distribution-title`}>
      <div className="sso-distribution-group-header">
        <div>
          <h3 id={`${group.id}-distribution-title`}>{group.title}</h3>
          <span>{group.description}</span>
        </div>
        <strong>{formatNumber(group.total)}</strong>
      </div>

      <div className="sso-distribution-bars">
        {group.items.map((item) => {
          const width = item.count > 0 ? Math.max(item.percentage, 2) : 0;
          const tooltip = `${item.label}: ${formatNumber(item.count)} student (${formatPercentage(item.percentage)})`;

          return (
            <button
              key={item.key}
              type="button"
              className={`sso-distribution-bar-button ${activeKey === item.key ? "is-active" : ""}`}
              style={{ "--distribution-size": `${width}%` }}
              data-tooltip={tooltip}
              aria-label={tooltip}
              onMouseEnter={() => onFocusItem(item)}
              onFocus={() => onFocusItem(item)}
              onClick={() => {
                onFocusItem(item);
                onSelectItem(item);
              }}
            >
              <span className="sso-distribution-bar-label">{item.label}</span>
              <span className="sso-distribution-bar-track" aria-hidden="true">
                <span className="sso-distribution-bar-fill" />
              </span>
              <span className="sso-distribution-bar-value">
                {formatNumber(item.count)}
                <small>{formatPercentage(item.percentage)}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DistributionDetail({ item }) {
  if (!item) return null;

  return (
    <aside className="sso-distribution-detail" aria-live="polite">
      <span className="sso-distribution-detail-eyebrow">Detail kelompok</span>
      <strong>{item.label}</strong>
      <span className="sso-distribution-detail-count">
        {formatNumber(item.count)} <small>student</small>
      </span>
      <p>{formatPercentage(item.percentage)} dari total student terpetakan.</p>
      {item.label === "Belum diisi" && (
        <span className="sso-distribution-detail-note">
          Lengkapi data jenjang agar pembagian student lebih akurat.
        </span>
      )}
    </aside>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatPercentage(value) {
  return `${value.toFixed(1).replace(".0", "")}%`;
}

function getDisplayName(name) {
  if (!name) return "JK";

  const nameParts = name.trim().split(" ");
  return nameParts[nameParts.length - 1];
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
