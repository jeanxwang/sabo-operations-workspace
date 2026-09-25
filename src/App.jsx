import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentBuddyDashboard from "./pages/StudentBuddyDashboard";
import StudentBuddyStudents from "./pages/StudentBuddyStudents";
import StudentBuddyTickets from "./pages/StudentBuddyTickets";
import SSODashboard from "./pages/SSODashboard";
import SSOStudents from "./pages/SSOStudents";
import SSOStudentDetail from "./pages/SSOStudentDetail";
import StudentBuddyHandover from "./pages/StudentBuddyHandover";
import AcademicDashboard from "./pages/AcademicDashboard";
import AcademicUniversities from "./pages/AcademicUniversities";
import AcademicScholarships from "./pages/AcademicScholarships";
import OpsDashboard from "./pages/OpsDashboard";
import OpsOnboardingReports from "./pages/OpsOnboardingReports";
import MOStudents from "./pages/MOStudents";

export default function App() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  function handleLoginSuccess(user) {
    navigate(getDefaultRouteByRole(user.role));
  }

  function handleLogout() {
    localStorage.removeItem("sabo_current_user");
    navigate("/");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate to={getDefaultRouteByRole(currentUser.role)} replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route
        path="/student-buddy/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student-buddy"]}>
            <StudentBuddyDashboard
              user={currentUser}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-buddy/students"
        element={
          <ProtectedRoute allowedRoles={["student-buddy"]}>
            <StudentBuddyStudents user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-buddy/tickets"
        element={
          <ProtectedRoute allowedRoles={["student-buddy"]}>
            <StudentBuddyTickets user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sso/dashboard"
        element={
          <ProtectedRoute allowedRoles={["sso"]}>
            <SSODashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sso/students"
        element={
          <ProtectedRoute allowedRoles={["sso"]}>
            <SSOStudents user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sso/students/:studentId"
        element={
          <ProtectedRoute allowedRoles={["sso"]}>
            <SSOStudentDetail user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-buddy/handover"
        element={
          <ProtectedRoute allowedRoles={["student-buddy"]}>
            <StudentBuddyHandover user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academic/dashboard"
        element={
          <ProtectedRoute allowedRoles={["academic"]}>
            <AcademicDashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academic/universities"
        element={
          <ProtectedRoute allowedRoles={["academic"]}>
            <AcademicUniversities user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academic/scholarships"
        element={
          <ProtectedRoute allowedRoles={["academic"]}>
            <AcademicScholarships user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ops/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ops"]}>
            <OpsDashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ops/onboarding-reports"
        element={
          <ProtectedRoute allowedRoles={["ops"]}>
            <OpsOnboardingReports user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mo/students"
        element={
          <ProtectedRoute allowedRoles={["mo"]}>
            <MOStudents user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="/mo/handover" element={<Navigate to="/mo/students" replace />} />
      <Route path="/mo/student-profiles" element={<Navigate to="/mo/students" replace />} />
      <Route path="/mo/onboarding-checklist" element={<Navigate to="/mo/students" replace />} />

      <Route
        path="/student-buddy/students/:studentId"
        element={
          <ProtectedRoute allowedRoles={["student-buddy"]}>
            <SSOStudentDetail
              user={currentUser}
              onLogout={handleLogout}
              role="student-buddy"
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoute({ allowedRoles, children }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getDefaultRouteByRole(currentUser.role)} replace />;
  }

  return children;
}

function getCurrentUser() {
  const savedUser = localStorage.getItem("sabo_current_user");

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser);
}

function getDefaultRouteByRole(role) {
  const routes = {
    "student-buddy": "/student-buddy/dashboard",
    hotline: "/hotline/dashboard",
    sso: "/sso/dashboard",
    rania: "/rania/dashboard",
    academic: "/academic/dashboard",
    ops: "/ops/dashboard",
    mo: "/mo/students",
  };

  return routes[role] || "/";
}
