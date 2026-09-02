import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Grid2X2,
  List,
  LogOut,
  Users,
} from "lucide-react";
import schotersLogo from "../assets/schoters-logo.png";
import DetailField from "../components/DetailField";
import { mockSsoStudents } from "../data/mockSsoStudents";
import { mockSsoStudentDetails, SSO_DETAIL_TABS } from "../data/mockSsoStudentDetails";
import "./StudentBuddyDashboard.css";
import "./SSOStudentDetail.css";

function navLinkClass({ isActive }) {
  return `sidebar-link ${isActive ? "active" : ""}`;
}

export default function SSOStudentDetail({ user, onLogout }) {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil");

  const studentSummary = mockSsoStudents.find((s) => s.id === studentId);
  const detail = mockSsoStudentDetails[studentId];

  if (!studentSummary || !detail) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-main">
          <div className="detail-not-found">
            <p>Student tidak ditemukan.</p>
            <button type="button" className="outline-button" onClick={() => navigate("/sso/students")}>
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
            <NavLink to="/sso/students" className="breadcrumb-link">
              Students
            </NavLink>
            <span className="breadcrumb-separator">›</span>
            <strong>{detail.name}</strong>
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

        <div className="student-detail-page-header fade-in-up" style={{ "--delay": "0ms" }}>
          <button type="button" className="back-link" onClick={() => navigate("/sso/students")}>
            <ArrowLeft size={18} />
            Kembali
          </button>

          <div className="student-detail-page-title">
            <h1>{detail.name}</h1>
            <span className="student-detail-page-id">{studentId}</span>
            {detail.overallStatus && (
              <span className="page-status-badge">{detail.overallStatus}</span>
            )}
          </div>
        </div>

        <nav className="detail-tabs" role="tablist">
          {SSO_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "detail-tab active" : "detail-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="detail-tab-panel fade-in-up" style={{ "--delay": "60ms" }}>
          {activeTab === "profil" && <ProfilTab detail={detail} studentId={studentId} />}
          {activeTab === "bahasa" && <BahasaTab detail={detail} />}
          {activeTab === "dokumen" && <DokumenTab detail={detail} />}
          {activeTab === "akademik" && <AkademikTab detail={detail} />}
          {activeTab === "aplikasi" && <AplikasiTab detail={detail} />}
          {activeTab === "ops" && <OpsTab detail={detail} />}
        </section>
      </section>
    </main>
  );
}

function ProfilTab({ detail, studentId }) {
  return (
    <div className="detail-field-grid">
      <DetailField label="Nama" value={detail.name} />
      <DetailField label="Student ID" value={studentId} />
      <DetailField label="Email" value={detail.email} />
      <DetailField label="Phone Number" value={detail.phone} />
      <DetailField label="End Date" value={detail.endDate} />
      <DetailField label="Overall Status" value={detail.overallStatus} />
      <DetailField label="Keaktifan Student?" value={detail.keaktifan} />
      <DetailField label="GPA/Rapor" value={detail.gpa} />
      <DetailField label="Skor Standardized Test" value={detail.skorStandardizedTest} />
      <DetailField label="Tag SP" value={detail.tagSp} />
      <DetailField label="Current Degree (SSO)" value={detail.currentDegree} />
    </div>
  );
}

function BahasaTab({ detail }) {
  return (
    <div className="detail-field-grid">
      <DetailField label="Status Persiapan Language Proficiency" value={detail.statusPersiapanLanguage} />
      <DetailField label="Skor Language Test" value={detail.skorLanguageTest} />
      <DetailField label="Jenis Language Proficiency" value={detail.jenisLanguageProficiency} />
      <DetailField label="Jenis Standardized Test" value={detail.jenisStandardizedTest} />
      <DetailField label="Other Language/Standardized Test" value={detail.otherLanguageTest} />
      <DetailField label="Jadwal Tes IELTS/TOEFL" value={detail.jadwalTesIeltsToefl} />
      <DetailField label="Jadwal Tes SAT/ACT" value={detail.jadwalTesSatAct} />
    </div>
  );
}

function DokumenTab({ detail }) {
  return (
    <div className="detail-field-grid">
      <DetailField label="Transkrip" value={detail.transkrip} />
      <DetailField label="Ijazah/Expected Graduation" value={detail.ijazah} />
      <DetailField label="Passport" value={detail.passport ? "Sudah ada" : ""} />
      <DetailField label="CV" value={detail.cv} />
      <DetailField label="Recommendation Letter" value={detail.recommendationLetter} />
      <DetailField label="Motivation Letter/Personal Statement/Essay" value={detail.motivationLetter} />
      <DetailField label="Research Proposal" value={detail.researchProposal} />
    </div>
  );
}

function AkademikTab({ detail }) {
  return (
    <>
      <div className="detail-field-grid">
        <DetailField label="Kurikulum Sekolah" value={detail.kurikulumSekolah} />
        <DetailField label="Achievement" value={detail.achievement} />
        <DetailField label="Activities" value={detail.activities} />
        <DetailField label="Tahun Ajaran (SSO)" value={detail.tahunAjaran} />
        <DetailField label="Skor IB" value={detail.skorIB} />
      </div>

      <h3 className="detail-subsection-title">A Level</h3>
      <div className="detail-field-grid">
        {detail.subjectALevel.map((subject, index) => (
          <DetailField
            key={`a-level-${index}`}
            label={`Subject A Level ${index + 1}`}
            value={subject}
          />
        ))}
        {detail.skorALevel.map((score, index) => (
          <DetailField
            key={`a-level-score-${index}`}
            label={`Skor A Level ${index + 1}`}
            value={score}
          />
        ))}
        <DetailField label="Skor A Level (Overall)" value={detail.skorALevelOverall} />
      </div>

      <h3 className="detail-subsection-title">IB — Higher Level</h3>
      <div className="detail-field-grid">
        {detail.subjectHL.map((subject, index) => (
          <DetailField key={`hl-${index}`} label={`Subject HL ${index + 1}`} value={subject} />
        ))}
        {detail.skorHL.map((score, index) => (
          <DetailField key={`hl-score-${index}`} label={`HL ${index + 1} Score`} value={score} />
        ))}
      </div>

      <h3 className="detail-subsection-title">IB — Standard Level</h3>
      <div className="detail-field-grid">
        {detail.subjectSL.map((subject, index) => (
          <DetailField key={`sl-${index}`} label={`Subject SL ${index + 1}`} value={subject} />
        ))}
        {detail.skorSL.map((score, index) => (
          <DetailField key={`sl-score-${index}`} label={`SL ${index + 1} Score`} value={score} />
        ))}
      </div>
    </>
  );
}

function AplikasiTab({ detail }) {
  return (
    <>
      <div className="detail-field-grid">
        <DetailField label="Jumlah University Applied" value={detail.jumlahUniversityApplied} />
        <DetailField label="Jumlah Active Submissions" value={detail.jumlahActiveSubmissions} />
        <DetailField label="Jumlah Beasiswa Applied" value={detail.jumlahBeasiswaApplied} />
        <DetailField label="University and Deadline" value={detail.universityAndDeadline} />
        <DetailField label="Scholarship and Deadline" value={detail.scholarshipAndDeadline} />
      </div>

      <h3 className="detail-subsection-title">Hasil Aplikasi</h3>
      <div className="detail-field-grid">
        <DetailField label="Jumlah University Accepted" value={detail.jumlahUniversityAccepted} />
        <DetailField label="Jumlah Beasiswa Accepted" value={detail.jumlahBeasiswaAccepted} />
        <DetailField
          label="Jumlah Active or Accepted Submissions"
          value={detail.jumlahActiveOrAcceptedSubmissions}
        />
        <DetailField label="Jumlah University Taken" value={detail.jumlahUniversityTaken} />
        <DetailField label="Jumlah Beasiswa Taken" value={detail.jumlahBeasiswaTaken} />
      </div>
    </>
  );
}

function OpsTab({ detail }) {
  return (
    <div className="detail-field-grid">
      <DetailField label="Hasil Diagnosing" value={detail.hasilDiagnosing} />
      <DetailField label="Link Learning Plan" value={detail.linkLearningPlan} />
      <DetailField label="PIC SSO (new)" value={detail.picSso} />
      <DetailField label="Jadwal Cek Harian" value={detail.jadwalCekHarian} />
      <DetailField label="Sisa Token Vidcall" value={detail.sisaTokenVidcall} />
      <DetailField label="Total Token Vidcall" value={detail.totalTokenVidcall} />
      <DetailField label="Sisa Token Docrev" value={detail.sisaTokenDocrev} />
      <DetailField label="Total Token Docrev" value={detail.totalTokenDocrev} />
      <DetailField label="Token Vidcall Taken" value={detail.tokenVidcallTaken} />
    </div>
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