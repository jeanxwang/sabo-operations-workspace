import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentBuddyDashboard from "./pages/StudentBuddyDashboard";
import StudentBuddyStudents from "./pages/StudentBuddyStudents";

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
  };

  return routes[role] || "/";
}