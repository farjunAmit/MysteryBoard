import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../../api/auth.api.js";
import { setToken } from "../../auth/authStorage.js";
import { texts as t } from "../../texts";

const AdminConnect = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await AuthApi.login({ email, password });
      } else {
        response = await AuthApi.register({ email, password, displayName });
      }

      if (response && response.token) {
        setToken(response.token);
        onClose();
        navigate("/admin");
      } else {
        setError(t.admin.login.authError);
      }
    } catch (err) {
      setError(err.message || t.admin.login.authError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeButton}>✕</button>
        
        <h1 style={styles.title}>
          {isLogin ? t.admin.login.loginTitle : t.admin.login.registerTitle}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>{t.admin.login.emailPlaceholder}:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>{t.admin.login.passwordPlaceholder}:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <div style={styles.formGroup}>
              <label>{t.admin.login.displayNamePlaceholder}:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading
              ? t.admin.login.loading
              : isLogin
              ? t.admin.login.submitLogin
              : t.admin.login.submitRegister}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <p>
            {isLogin ? t.admin.login.noAccount : t.admin.login.haveAccount}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setDisplayName("");
              }}
              style={styles.toggleButton}
            >
              {isLogin ? t.admin.login.registerLink : t.admin.login.loginLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  submitButton: {
    padding: "10px 20px",
    width: "100%",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
  toggleContainer: {
    marginTop: "15px",
    textAlign: "center",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default AdminConnect;