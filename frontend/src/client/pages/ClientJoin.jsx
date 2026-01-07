import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminConnect from "../../admin/components/AdminConnect";
import { ClientSessionsApi } from "../../api/clientSessions.api";
import { texts as t } from "../../texts";
import "../styles/client.css";
import "../styles/pages/ClientJoin.css";

export default function ClientJoin() {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const navigate = useNavigate();

  const handleJoin = async () => {  
    if (!joinCode.trim()) {
      setError(t.client.join.errorEmptyCode);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { sessionId } = await ClientSessionsApi.getByJoinCode(joinCode.trim());
      navigate(`/client/${sessionId}`);
    } catch (err) {
      setError(t.client.join.errorInvalidCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-join__container">
      <button 
        onClick={() => setShowAdminModal(true)} 
        className="client-join__admin-button"
      >
        Admin
      </button>

      <h1 className="client-join__title">{t.client.join.title}</h1>

      <input
        type="text"
        placeholder={t.client.join.inputPlaceholder}
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        disabled={loading}
        className="client-join__input"
      />

      <button onClick={handleJoin} disabled={loading} className="client-join__button">
        {loading ? t.client.join.loadingButton : t.client.join.joinButton}
      </button>

      {error && <div className="client-join__error">{error}</div>}

      <AdminConnect isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  );
}