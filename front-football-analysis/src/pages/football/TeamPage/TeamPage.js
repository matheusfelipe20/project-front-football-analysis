import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../../variables/Colors.css'
import './teamPage.css'

import iconFootball from "../../../assets/icons/icon-football.svg";
import countries from "../../../assets/icons/country/countries.json";

const TeamPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [leagueDetails, setLeagueDetails] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        //Primeira requisição para obter o time
        const response = await axios.get(
          `https://project-football-analysis-1.onrender.com/football/team/${teamId}`
        );
        setTeam(response.data);

        //Após obter o nome do time, é feito uma segunda requisição para pegar a liga e o país
        const teamName = response.data.name;
        const leagueResponse = await axios.get(
          `https://project-football-analysis-1.onrender.com/football/team/search?name=${teamName}`
        );
        setLeagueDetails(leagueResponse.data[0]?.league);
      } catch (error) {
        console.error("Erro ao buscar dados do time:", error);
      }
    };
    fetchTeamData();
  }, [teamId]);

  if (!team || !leagueDetails) {
    return (
      <div className="leagueDetails-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const countryCode = Object.keys(countries).find(
    (key) => countries[key] === leagueDetails.country
  );

  //Usando require para carregar dinamicamente a bandeira
  const flagSrc = countryCode ? require(`../../../assets/icons/country/${countryCode.toLowerCase()}.svg`) : null;

  return (
    <div className="team-details">
      <div className="panel-details">
        <div className="details-header-intro">
          <img className="details-sport-icon" src={iconFootball} alt="icone bola de futebol"/>
          <p className="details-sport-text">Futebol</p>
          <p className="details-sport-text">•</p>
          <div className="details-country">
            {leagueDetails.country && (
              <>
                {flagSrc && (
                  <img
                    src={flagSrc}
                    alt={`${leagueDetails.country} flag`}
                    className="details-country-flag"
                  />
                )}
                <p className="details-sport-text">{leagueDetails.country}</p>
              </>
            )}
          </div>
        </div>
        <div className="details-conteiner">
          <img src={team.imageUrl} alt={team.name} className="team-image" />
          <div className="details-team-info">
            <h1 className="details-team-name">{team.name}</h1>
            <span className="details-team-leagueName">Liga: {leagueDetails.name}</span>
          </div>
        </div>
      </div>
      {/* <div className="panel-statistic">
          <p>Estatísticas do time</p>
      </div> */}
    </div>
  );
};

export default TeamPage;
