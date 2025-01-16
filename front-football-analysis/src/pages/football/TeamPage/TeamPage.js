import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../../variables/Colors.css'
import './teamPage.css'

import iconFootball from "../../../assets/icons/icon-football.svg";
import countries from "../../../assets/icons/country/countries.json";
import AnalysisPanel from "./StatisticsPanel/analysisPanel";
import GraphPanel from "./StatisticsGraph/staticGraph";
import Divider from "../../../components/divider/divider";
import InfoCrud from "./CrudTeamInfo/InfoCrud";

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
    <div className="team-information">
      <div className="panel-information">
        <div className="information-header-intro">
          <img className="information-sport-icon" src={iconFootball} alt="icone bola de futebol"/>
          <p className="information-sport-text">Futebol</p>
          <p className="information-sport-text">•</p>
          <div className="information-country">
            {leagueDetails.country && (
              <>
                {flagSrc && (
                  <img
                    src={flagSrc}
                    alt={`${leagueDetails.country} flag`}
                    className="information-country-flag"
                  />
                )}
                <p className="information-sport-text">{leagueDetails.country}</p>
              </>
            )}
          </div>
        </div>
        <div className="information-conteiner">
          <div className="information-container-left">
            <img src={team.imageUrl} alt={team.name} className="information-team-image" />
            <div className="information-team-info">
              <h1 className="information-team-name">{team.name}</h1>
              <Divider width="100%" color="#c5c5c5" height={'1px'} margin={'0px'} />
              <span className="information-team-leagueName">{leagueDetails.name}</span>
              <span className="information-team-leagueDivision">{leagueDetails.division}</span>
            </div>
          </div>
          <div className="information-container-right">
            <img src={leagueDetails.imageUrl} alt={leagueDetails.name} className="information-league-image" />
          </div>
        </div>
        <div className="information-divider">
          <Divider width="3%" color="#77715b" height={'2px'} margin={'14px'} />
        </div>
        <InfoCrud teamId={teamId}/>
      </div>
      <div className="panel-analysis">
        <GraphPanel teamId={teamId} />
        <AnalysisPanel teamId={teamId}/>
      </div>
    </div>
  );
};

export default TeamPage;
