import React from "react";
import MatchItem from "./MatchItem";
import "./MatchList.css";
import countries from "../../../../assets/icons/country/countries.json";
import Divider from "../../../../components/divider/divider.jsx";

const MatchList = () => {
  const brasileiraoA = {
    country: "Brasil",
    league: "Brasileirão A",
    date: "Hoje",
    matches: [
      { time: "20:00", teamA: "Time A", teamB: "Time B" },
      { time: "21:30", teamA: "Time C", teamB: "Time D" },
      { time: "22:00", teamA: "Time E", teamB: "Time F" },
    ],
  };

  const championsLeague = {
    country: "Europa",
    league: "Champions League",
    date: "Hoje",
    matches: [
      { time: "16:00", teamA: "Time G", teamB: "Time H" },
      { time: "16:30", teamA: "Time I", teamB: "Time J" },
    ],
  };

  const laLiga = {
    country: "Espanha",
    league: "La Liga",
    date: "Amanhã",
    matches: [
      { time: "15:00", teamA: "Time K", teamB: "Time L" },
      { time: "16:30", teamA: "Time M", teamB: "Time N" },
      { time: "16:30", teamA: "Time O", teamB: "Time P" },
    ],
  };

  const Eredivisie = {
    country: "Países Baixos",
    league: "Eredivisie",
    date: "Amanhã",
    matches: [
      { time: "14:45", teamA: "Time Q", teamB: "Time R" },
      { time: "16:00", teamA: "Time S", teamB: "Time T" },
      { time: "17:00", teamA: "Time U", teamB: "Time V" },
    ],
  };

  const LigueOne = {
    country: "França",
    league: "Ligue 1",
    date: "Amanhã",
    matches: [
      { time: "16:45", teamA: "Time 1", teamB: "Time 2" },
    ],
  };

  const championships = [championsLeague, brasileiraoA, laLiga, Eredivisie, LigueOne];

  return (
    <div className="match-list">
        <h1>Cronograma</h1>
        <Divider width="100%" color="#e1e1e1" height={"2px"} margin={"0px"} />
      {championships.map((championship, index) => {

        const countryCode = Object.keys(countries).find(
          (key) => countries[key] === championship.country
        );

        const flagSrc = countryCode
          ? require(`../../../../assets/icons/country/${countryCode.toLowerCase()}.svg`)
          : null;

        return (
          <div key={index} className="championship-section">
            <div className="championship-title-list">
                <div className="championship-title-flags">
                    {flagSrc && (
                        <img
                        src={flagSrc}
                        alt={`${championship.country} flag`}
                        className="matchList-flag-icon"
                        />
                    )}
                    <p>{championship.country}</p>
                </div>
                <p>|</p>
                <h2 className="match-title">
                    {championship.league}
                </h2>
            </div>
            <div className="matchList-date">
              <p>{championship.date}</p>
            </div>
            {championship.matches.map((match, matchIndex) => (
              <MatchItem
                key={matchIndex}
                time={match.time}
                teamA={match.teamA}
                teamB={match.teamB}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;