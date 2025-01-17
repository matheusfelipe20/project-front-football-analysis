import React, { useState, useEffect } from "react";
import "./header.css";
import "../../variables/Colors.css";
import imgHeader from "../../assets/logo-header.png";
import { Link, useNavigate } from "react-router-dom";
import HeaderSearch from "./headerSearch/HeaderSearch";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import iconSuccess from "../../assets/icons/icon-success.svg";
import iconError from "../../assets/icons/icon-error.svg";

const Header = ({ token, setToken }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [iconState, setIconState] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null); // Atualiza o estado global
    navigate("/");
  };

  const handleActivateApi = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://project-football-analysis-1.onrender.com/football/league"
      );

      if (response.status === 200) {
        setApiStatus({ type: "success", message: "API Ligada" });
      } else {
        setApiStatus({ type: "error", message: "Erro ao ativar API" });
      }
    } catch (error) {
      setApiStatus({ type: "error", message: "Erro ao ativar API" });
      console.error("Erro ao ativar a API", error);
    } finally {
      setIsLoading(false);
    }
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

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIconState(!iconState);
  };

  return (
    <header>
      <div className="header">
        <div className="header-top">
          <div className="header-logo">
            <Link to="/">
              <img className="logo" src={imgHeader} alt="Logo MatthScore" />
              <p className="logo-name">MatthScore</p>
            </Link>
          </div>
          <div className="header-search">
            <HeaderSearch />
          </div>
        </div>
        <div className="header-down">
          <div className="nav-links-options">
            <nav>
              <ul className="nav-links">
                <li>
                  <div>
                    <Tabs />
                  </div>
                  <div className="option-login-menu">
                    {token ? (
                      <button onClick={handleLogout} className="exit-button">Sair</button>
                    ) : (
                      <Link to="/login">
                        <button className="login-button">Login</button>
                      </Link>
                    )}
                    <button
                      className="nav-options"
                      onClick={handleDropdownToggle}
                    >
                      <span
                        className={`nav-icon-config ${
                          iconState ? "plus" : "minus"
                        }`}
                      >
                        {iconState ? "☰" : "✖"}
                      </span>
                      {isDropdownOpen && (
                        <div className="dropdown-menu">
                          <button onClick={handleActivateApi}>Ativar API</button>
                        </div>
                      )}
                    </button>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Animação de loading */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

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