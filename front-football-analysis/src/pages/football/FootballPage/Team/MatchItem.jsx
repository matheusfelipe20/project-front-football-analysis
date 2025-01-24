import React, { useState } from "react";
import "./MatchItem.css";

import iconFavoriteOpen from "../../../../assets/icons/icon-favorite-open.svg";
import iconFavoriteClose from "../../../../assets/icons/icon-favorite-close.svg";

const MatchItem = ({ time, teamA, teamB }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="match-item">
      <div className="match-time">{time}</div>
      <div className="match-teams">
        <span className="team">{teamA}</span>
        <span className="vs"> vs </span>
        <span className="team">{teamB}</span>
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