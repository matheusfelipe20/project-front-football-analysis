import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Tabs.css";


import iconHome from "../../assets/icons/icon-home.svg";
import iconFootball from "../../assets/icons/icon-football.svg";
import iconTableBet from "../../assets/icons/icon-table.svg";

const Tabs = () => {
  const location = useLocation();

  const tabs = [
    { id: "home", label: "Inicio", icon: iconHome, path: "/home" },
    { id: "football", label: "Futebol", icon: iconFootball, path: "/football" },
    { id: "tableBet", label: "GestãoBet", icon: iconTableBet, path: "/tableBet" },
  ];

  return (
    <div className="tabs-container">
      <ul className="tabs-header">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`tab-item ${location.pathname === tab.path ? "active" : ""}`}
          >
            <Link to={tab.path} className="tab-link">
              <img src={tab.icon} alt={`${tab.label} icon`} className="tab-icon" />
              <p className="tab-label">{tab.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
