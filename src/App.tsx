import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // keep this untouched
import LoginCardSection from "@/components/ui/login-signup"; // your preserved component
import { CreateJoinWorkspace } from "./pages/CreateJoinWorkspace";
import { WorkspacePage } from "./pages/WorkspacePage";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export const App = () => (
  <>
    <Toaster position="top-center" />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginCardSection />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspace/create-join"
          element={
            <ProtectedRoute>
              <CreateJoinWorkspace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspace/:id"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </>
);
