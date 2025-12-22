import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./admin/pages/AdminHome";
import AdminLiveSession from "./admin/pages/AdminLiveSession";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/sessions/:id" element={<AdminLiveSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
