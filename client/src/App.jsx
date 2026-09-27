import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meeting/:roomId"
        element={
          <ProtectedRoute>
            <MeetingRoom />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
