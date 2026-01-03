import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminConnect from "../../admin/components/AdminConnect";
import { ClientSessionsApi } from "../../api/clientSessions.api";
import { texts as t } from "../../texts";

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
    <div style={styles.container}>
      <button 
        onClick={() => setShowAdminModal(true)} 
        style={styles.adminButton}
      >
        Admin
      </button>

      <h1>{t.client.join.title}</h1>

      <input
        type="text"
        placeholder={t.client.join.inputPlaceholder}
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        disabled={loading}
        style={styles.input}
      />

      <button onClick={handleJoin} disabled={loading} style={styles.button}>
        {loading ? t.client.join.loadingButton : t.client.join.joinButton}
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <AdminConnect isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: "80px auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    textAlign: "center",
    position: "relative",
  },
  adminButton: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
};