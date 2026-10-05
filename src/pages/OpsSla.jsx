import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClockAlert,
  FileText,
  Grid2X2,
  LogOut,
  Search,
  Timer,
  Users,
  X,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import TopbarActions from "../components/TopbarActions";
import {
  getOpsSlaEventMetrics,
  mockOpsStudents,
} from "../data/mockOpsStudents";
import "../pages/StudentBuddyDashboard.css";
import "./OpsSla.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function OpsSla({ user, onLogout }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventMetrics = useMemo(() => getOpsSlaEventMetrics(mockOpsStudents, {
    from: dateFrom ? parseDateInput(dateFrom) : null,
    to: dateTo ? parseDateInput(dateTo) : null,
  }), [dateFrom, dateTo]);
  const filteredStudentCount = useMemo(() => new Set(eventMetrics.flatMap((event) => event.records.map((record) => record.student.id))).size, [eventMetrics]);
  const ownerOptions = useMemo(() => [...new Set(eventMetrics.flatMap((event) => event.owners))].sort(), [eventMetrics]);
  const filteredEventMetrics = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return eventMetrics.filter((event) => {
      const matchesSearch = !keyword || [event.label, event.description, ...event.owners].join(" ").toLowerCase().includes(keyword);
      const matchesFilter = activeFilter === "all"
        || (activeFilter === "below-target" && event.completionPercent < event.targetPercent)
        || (activeFilter === "on-target" && event.completionPercent >= event.targetPercent);
      const matchesOwner = ownerFilter === "all" || event.owners.includes(ownerFilter);
      return matchesSearch && matchesFilter && matchesOwner;
    });
  }, [activeFilter, eventMetrics, ownerFilter, searchKeyword]);

  const overview = useMemo(() => {
    const totalEvents = eventMetrics.reduce((sum, event) => sum + event.totalCount, 0);
    const completedEvents = eventMetrics.reduce((sum, event) => sum + event.completedCount, 0);
    const fulfillmentPercent = totalEvents ? Math.round((completedEvents / totalEvents) * 100) : 0;
    return {
      totalEvents,
      completedEvents,
      pendingEvents: totalEvents - completedEvents,
      fulfillmentPercent,
      unfulfillmentPercent: totalEvents ? 100 - fulfillmentPercent : 0,
      belowTarget: eventMetrics.filter((event) => event.completionPercent < event.targetPercent).length,
    };
  }, [eventMetrics]);

  return (
    <main className="dashboard-page ops-dashboard-page ops-sla-page">
      <aside className="sidebar">
        <header className="sidebar-brand">
          <img className="sidebar-brand-logo" src={schotersLogo} alt="Schoters" />
          <span>SABO</span>
        </header>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/ops/dashboard" end className={navLinkClass}>
            <Grid2X2 size={22} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/ops/onboarding-reports" className={navLinkClass}>
            <FileText size={22} />
            <span>Onboarding Session</span>
          </NavLink>
          <NavLink to="/ops/sla" className={navLinkClass}>
            <ClockAlert size={22} />
            <span>SLA monitoring</span>
          </NavLink>
        </nav>

        <footer className="sidebar-profile">
          <span className="profile-avatar">{getInitials(user?.name)}</span>
          <span><strong>{user?.name || "Ops Team"}</strong><small>Operations</small></span>
          <button type="button" className="sidebar-logout-button" aria-label="Keluar" title="Keluar" onClick={onLogout}><LogOut size={17} /></button>
        </footer>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumbs"><span>SABO Operations</span><span className="breadcrumb-separator">›</span><span>Ops</span><span className="breadcrumb-separator">›</span><strong>SLA monitoring</strong></div>
          <TopbarActions />
        </header>

        <section className="ops-sla-content">
          <div className="ops-sla-heading fade-in-up" style={{ "--delay": "0ms" }}>
            <div>
              <p className="ops-eyebrow">SERVICE LEVEL AGREEMENT</p>
              <h1>Monitoring SLA</h1>
              <p>Ringkasan pemenuhan SLA SAA berdasarkan event, target, dan penanggung jawabnya.</p>
            </div>
            <span className="ops-sla-rule-note"><Timer size={15} /> Target pemenuhan setiap event: 90%</span>
          </div>

          <section className="ops-sla-date-card" aria-label="Filter tanggal SLA">
            <div className="ops-sla-date-title"><CalendarDays size={17} /><div><strong>Periode monitoring</strong><span>Filter berdasarkan tanggal event SLA. Setiap event dapat memiliki tanggal yang berbeda untuk setiap student.</span></div></div>
            <div className="ops-sla-date-fields">
              <label><span>Dari</span><input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} /></label>
              <span className="ops-sla-date-separator">—</span>
              <label><span>Sampai</span><input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} /></label>
              {(dateFrom || dateTo) && <button type="button" className="ops-sla-reset-date" onClick={() => { setDateFrom(""); setDateTo(""); }}>Reset tanggal</button>}
            </div>
          </section>

          <section className="ops-sla-stat-grid" aria-label="Ringkasan SLA">
            <SlaStat label="Total event SLA" value={overview.totalEvents} icon={Users} tone="blue" />
            <SlaStat label="% SLA terpenuhi" value={`${overview.fulfillmentPercent}%`} icon={CheckCircle2} tone="green" />
            <SlaStat label="SLA terpenuhi" value={overview.completedEvents} icon={CheckCircle2} tone="green" />
            <SlaStat label="% SLA belum terpenuhi" value={`${overview.unfulfillmentPercent}%`} icon={AlertTriangle} tone="orange" />
            <SlaStat label="SLA belum terpenuhi" value={overview.pendingEvents} icon={AlertTriangle} tone="red" />
          </section>

          <section className="ops-sla-card fade-in-up" style={{ "--delay": "120ms" }}>
            <header className="ops-sla-card-header">
              <div><h2>SLA terpenuhi berdasarkan event</h2><p>Lihat performa setiap event SAA dan orang yang bertanggung jawab untuk menindaklanjutinya.</p></div>
              <span><Users size={15} /> {eventMetrics.length} event · {filteredStudentCount} student</span>
            </header>
            <div className="ops-sla-toolbar">
              <label className="ops-sla-search"><Search size={18} /><input type="search" placeholder="Cari event atau penanggung jawab..." value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} /></label>
              <label className="ops-sla-owner-filter"><span>Penanggung jawab</span><select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option value="all">Semua</option>{ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select></label>
              <div className="ops-sla-filters" role="tablist" aria-label="Filter pemenuhan SLA">
                {[
                  { id: "all", label: "Semua event", count: eventMetrics.length },
                  { id: "below-target", label: "Di bawah target", count: overview.belowTarget },
                  { id: "on-target", label: "Mencapai target", count: eventMetrics.length - overview.belowTarget },
                ].map((filter) => <button key={filter.id} type="button" role="tab" aria-selected={activeFilter === filter.id} className={activeFilter === filter.id ? "active" : ""} onClick={() => setActiveFilter(filter.id)}>{filter.label}<span>{filter.count}</span></button>)}
              </div>
            </div>
            <div className="ops-sla-table-wrapper">
              <table className="ops-sla-table">
                <thead><tr><th>Program category</th><th>Event</th><th>Tanggal event</th><th>% Target</th><th>% Terpenuhi</th><th>SLA terpenuhi</th><th>SLA tidak terpenuhi</th><th>Penanggung jawab</th><th aria-label="Aksi" /></tr></thead>
                <tbody>
                  {filteredEventMetrics.map((event) => <tr key={event.id}>
                      <td><strong>SAA</strong><span>Student onboarding</span></td>
                      <td><strong>{event.label}</strong><span>{event.description}</span></td>
                      <td><strong>{getEventDateSummary(event.records)}</strong><span>{event.records.length} aktivitas</span></td>
                      <td><strong>{event.targetPercent}%</strong></td>
                      <td><SlaPercent value={event.completionPercent} target={event.targetPercent} /></td>
                      <td><strong className="ops-sla-count-complete">{event.completedCount}</strong><span>dari {event.totalCount} student</span></td>
                      <td><strong className="ops-sla-count-pending">{event.pendingCount}</strong><span>dari {event.totalCount} student</span></td>
                      <td><OwnerList owners={event.owners} /></td>
                      <td><button type="button" className="ops-sla-detail-button" onClick={() => setSelectedEvent(event)}>Lihat detail</button></td>
                    </tr>
                  )}
                  {filteredEventMetrics.length === 0 && <tr className="ops-sla-empty"><td colSpan={9}>Tidak ada event yang sesuai dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>

      {selectedEvent && <SlaEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </main>
  );
}

function SlaStat({ label, value, icon: Icon, tone }) {
  return <article className={`ops-sla-stat tone-${tone}`}><span><Icon size={17} /></span><small>{label}</small><strong>{value}</strong></article>;
}

function SlaPercent({ value, target }) {
  const meetsTarget = value >= target;
  return <span className={`ops-sla-percent ${meetsTarget ? "meets" : "below"}`}><strong>{value}%</strong><span><i style={{ width: `${Math.min(value, 100)}%` }} /></span></span>;
}

function OwnerList({ owners }) {
  return <span className="ops-sla-owner-list">{owners.slice(0, 2).map((owner) => <span key={owner}>{owner}</span>)}{owners.length > 2 && <small>+{owners.length - 2} lainnya</small>}</span>;
}

function SlaEventDetail({ event, onClose }) {
  return <div className="ops-sla-backdrop" role="presentation" onMouseDown={onClose}>
    <aside className="ops-sla-drawer" role="dialog" aria-modal="true" aria-labelledby="ops-sla-event-title" onMouseDown={(eventClick) => eventClick.stopPropagation()}>
      <header className="ops-sla-drawer-header"><div><span>SAA · SLA EVENT</span><h2 id="ops-sla-event-title">{event.label}</h2><p>{event.description}</p></div><button type="button" className="ops-sla-close" aria-label="Tutup detail" onClick={onClose}><X size={18} /></button></header>
      <div className={`ops-sla-drawer-summary ${event.completionPercent < event.targetPercent ? "has-overdue" : ""}`}><strong>{event.completionPercent}% terpenuhi</strong><span>Target {event.targetPercent}% · {event.completedCount} dari {event.totalCount} student</span></div>
      <section className="ops-sla-detail-meta"><h3>Penanggung jawab</h3><OwnerList owners={event.owners} /></section>
      <section className="ops-sla-event-students"><h3>Daftar student</h3>{event.records.map(({ student, completed, owner, eventDate }) => <div className="ops-sla-event-student" key={student.id}><div><strong>{student.name}</strong><span>{student.id} · {owner} · {eventDate ? formatOpsDate(eventDate) : "Tanggal belum tersedia"}</span></div><span className={`ops-sla-event-status ${completed ? "complete" : "pending"}`}>{completed ? "Terpenuhi" : "Belum terpenuhi"}</span></div>)}</section>
    </aside>
  </div>;
}

function getInitials(name) {
  if (!name) return "OP";
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

function parseDateInput(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getEventDateSummary(records) {
  const dates = [...new Set(records.map((record) => record.eventDate).filter(Boolean))].sort();
  if (dates.length === 0) return "Belum tersedia";
  if (dates.length === 1) return formatOpsDate(dates[0]);
  return `${formatOpsDate(dates[0])} – ${formatOpsDate(dates[dates.length - 1])}`;
}

function formatOpsDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Belum tersedia";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
