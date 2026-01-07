import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../../api/auth.api.js";
import { setToken } from "../../auth/authStorage.js";
import { texts as t } from "../../texts";
import "../styles/components/AdminConnect.css";

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
    <div className="admin-connect__overlay" onClick={onClose}>
      <div className="admin-connect__modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="admin-connect__close">✕</button>
        
        <h1 className="admin-connect__title">
          {isLogin ? t.admin.login.loginTitle : t.admin.login.registerTitle}
        </h1>

        <form onSubmit={handleSubmit} className="admin-connect__form">
          <div className="admin-connect__form-group">
            <label>{t.admin.login.emailPlaceholder}:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-connect__input"
            />
          </div>

          <div className="admin-connect__form-group">
            <label>{t.admin.login.passwordPlaceholder}:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-connect__input"
            />
          </div>

          {!isLogin && (
            <div className="admin-connect__form-group">
              <label>{t.admin.login.displayNamePlaceholder}:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="admin-connect__input"
              />
            </div>
          )}

          {error && <div className="admin-connect__error">{error}</div>}

          <button type="submit" disabled={loading} className="admin-connect__submit">
            {loading
              ? t.admin.login.loading
              : isLogin
              ? t.admin.login.submitLogin
              : t.admin.login.submitRegister}
          </button>
        </form>

        <div className="admin-connect__toggle-container">
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
              className="admin-connect__toggle-button"
            >
              {isLogin ? t.admin.login.registerLink : t.admin.login.loginLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConnect;