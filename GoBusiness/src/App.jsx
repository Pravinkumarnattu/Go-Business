import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ReferralDetails from "./components/ReferralDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referral/:id"
          element={
            <ProtectedRoute>
              <ReferralDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/not-found"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
