import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import ProtectedRoutes from "./pages/ProtectedRoutes.jsx";
import Login from "./pages/Login.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
