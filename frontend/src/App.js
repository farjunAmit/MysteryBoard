import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./admin/pages/AdminHome";
import AdminLiveSession from "./admin/pages/AdminLiveSession";
import AdminSessionControl from "./admin/pages/AdminSessionControl";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister";
import ProtectedRoute from "./auth/ProtectedRoute";
import ClientJoin from "./client/pages/ClientJoin";
import ClientScreen from "./client/pages/ClientScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Admin_User*/}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        {/* Default */}
        <Route path="/" element={<Navigate to="/client/join" replace />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions/:id"
          element={
            <ProtectedRoute>
              <AdminLiveSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sessions/:id/control"
          element={
            <ProtectedRoute>
              <AdminSessionControl />
            </ProtectedRoute>
          }
        />

        {/* Client */}
        <Route path="/client/join" element={<ClientJoin />} />
        <Route path="/client/:sessionId" element={<ClientScreen />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
