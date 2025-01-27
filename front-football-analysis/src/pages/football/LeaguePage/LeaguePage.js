import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";  // Importar o Link
import axios from "axios";
import "../../../variables/Colors.css";
import "./LeaguePage.css";

import countries from "../../../assets/icons/country/countries.json";
import Divider from "../../../components/divider/divider";

const LeaguePage = () => {
  const { leagueId } = useParams();
  const [leagueDetails, setLeagueDetails] = useState(null);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await axios.get(
          `https://project-football-analysis-1.onrender.com/football/league/${leagueId}`
        );
        setLeagueDetails(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da liga:", error);
      }
    };
    fetchLeagueData();
  }, [leagueId]);

  if (!leagueDetails) {
    return (
      <div className="leagueDetails-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const countryCode = Object.keys(countries).find(
    (key) => countries[key] === leagueDetails.country
  );

  const flagSrc = countryCode
    ? require(`../../../assets/icons/country/${countryCode.toLowerCase()}.svg`)
    : null;

  return (
    <div className="league-page">
      <div className="league-info">
        <img src={leagueDetails.imageUrl} alt={leagueDetails.name} className="league-image"/>
        <div className="league-details">
          <h1 className="league-name">{leagueDetails.name}</h1>
          <p className="league-division">{leagueDetails.division} | Futebol</p>
          <Divider margin={'0px'} height={'1px'} color="var(--color-divider-panel-League)" width="100%"/>
          <div className="league-country-panel">
            {flagSrc && (
              <img src={flagSrc} alt={`${leagueDetails.country} flag`} className="league-country-flag"/>
            )}
            <p className="league-country-name">{leagueDetails.country}</p>
          </div>
        </div>
      </div>

      <div className="league-teams-section">
        <div className="league-teams-header">
            <h2>Times Participantes</h2>
            <p>- útilma atualização em 2025</p>
        </div>
        <div className="league-teams-grid">
          {leagueDetails.teams.map((team) => (
            <Link to={`/football/team/${team.id}`} key={team.id} className="team-card-link">
              <div className="league-team-card">
                <img
                  src={team.imageUrl}
                  alt={team.teamName}
                  className="league-team-card-image"
                />
                <p className="league-team-card-name">{team.teamName}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaguePage;