import React, { useState, useEffect } from "react";
import "./header.css";
import "../../variables/Colors.css";
import imgHeader from "../../assets/logo-header.png";
import { Link, useNavigate } from "react-router-dom";
import HeaderSearch from "./headerSearch/HeaderSearch";
import Tabs from "../tabs/Tabs";
import iconSuccess from "../../assets/icons/icon-success.svg";
import iconError from "../../assets/icons/icon-error.svg";
import iconSettings from "../../assets/icons/icon-settings.svg";

const Header = ({ token, setToken }) => {
  const [apiStatus, setApiStatus] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/");
  };

  const handleCloseApiStatus = () => {
    setApiStatus("");
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    if (apiStatus) {
      const id = setTimeout(() => {
        setApiStatus("");
      }, 10000);
      setTimeoutId(id);

      return () => {
        clearTimeout(id);
      };
    }
  }, [apiStatus]);

  return (
    <header>
      <div className="header">
        <div className="header-top-contain">
          <div className="header-top">
            <div className="header-logo">
              <Link to="/football">
                <img className="logo" src={imgHeader} alt="Logo MatthScore" />
              </Link>
            </div>
            <div className="header-search">
              <HeaderSearch />
            </div>
            <div className="option-login-menu">
              {token ? (
                  <button onClick={handleLogout} className="exit-button">Sair</button>
                ) : (
                <Link to="/login">
                  <button className="login-button">Login</button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="header-down">
          <div className="nav-links-options">
            <nav>
              <ul className="nav-links">
                <li>
                  <div className="nav-links-contain">
                    <Tabs />
                    <button className="nav-button-iconSettings">
                      <img className="nav-image-iconSettings" src={iconSettings} alt="icone Configuração" />
                    </button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mensagem de sucesso ou erro com ícones e botão de fechar */}
      {apiStatus && (
        <div className={`api-status-message ${apiStatus.type}`}>
          <img
            src={apiStatus.type === "success" ? iconSuccess : iconError}
            alt={apiStatus.type}
            className="status-icon"
          />
          <p>{apiStatus.message}</p>
          <button className="close-button" onClick={handleCloseApiStatus}>
            ×
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;