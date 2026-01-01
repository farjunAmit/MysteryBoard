import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./admin/pages/AdminHome";
import AdminLiveSession from "./admin/pages/AdminLiveSession";
import AdminSessionControl from "./admin/pages/AdminSessionControl";
import ClientJoin from "./client/pages/ClientJoin";
import ClientScreen from "./client/pages/ClientScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/sessions/:id" element={<AdminLiveSession />} />
        <Route
          path="/admin/sessions/:id/control"
          element={<AdminSessionControl />}
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
