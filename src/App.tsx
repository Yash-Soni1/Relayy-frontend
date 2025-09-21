import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import  Home  from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export const App = () => (
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          color: "#000",
          fontWeight: "500",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)",
        },
      }}
    />


    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </>
);
