import React, { useState } from "react";
import "./MatchItem.css";

import iconFavoriteOpen from "../../../../assets/icons/icon-favorite-open.svg";
import iconFavoriteClose from "../../../../assets/icons/icon-favorite-close.svg";
import logoTeamDefault from "../../../../assets/team/default/logo-default.png";

const MatchItem = ({ time, teamA, teamB }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="match-item">
      <div className="match-time">{time}</div>
      <div className="match-teams">
        <div className="match-team">
          <img className="match-logo-team" src={logoTeamDefault} alt="logo time padrão"/>
          <span className="team">{teamA}</span>
        </div>
        <span className="vs"> vs </span>
        <div className="match-team">
          <span className="team">{teamB}</span>
          <img className="match-logo-team" src={logoTeamDefault} alt="logo time padrão"/>
        </div>
      </div>
      <div className="match-favorite">
        <button onClick={toggleFavorite}>
          <img
            src={isFavorited ? iconFavoriteClose : iconFavoriteOpen}
            alt={isFavorited ? "Unfavorite" : "Favorite"}
          />
        </button>
      </div>
    </div>
  );
};

export default MatchItem;