import React, { useState, useEffect } from 'react';
import countries from '../../../../assets/icons/country/countries.json';
import Divider from "../../../../components/divider/divider";
import './ChampionCountry.css';

const ChampionCountry = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [expandedCountries, setExpandedCountries] = useState({});

  useEffect(() => {
    // Função para buscar todas as ligas
    const fetchLeagues = async () => {
      try {
        const response = await fetch('https://project-football-analysis-1.onrender.com/football/league');
        const leagues = await response.json();

        // Agrupar ligas por país
        const groupedByCountry = leagues.reduce((acc, league) => {
          if (!acc[league.country]) {
            acc[league.country] = [];
          }
          acc[league.country].push(league);
          return acc;
        }, {});

        setCountriesData(Object.entries(groupedByCountry));
      } catch (error) {
        console.error('Erro ao buscar ligas:', error);
      }
    };

    fetchLeagues();
  }, []);

  const toggleCountry = (country) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [country]: !prev[country],
    }));
  };

  const getFlagSrc = (country) => {
    const countryCode = Object.keys(countries).find((key) => countries[key] === country);
    return countryCode ? require(`../../../../assets/icons/country/${countryCode.toLowerCase()}.svg`) : null;
  };

  return (
    <div className="champion-panelCountry">
      <h2>Todos os Campeonatos</h2>
      <Divider width="100%" color="#e1e1e1" height={"2px"} margin={"0px"} />
      {countriesData.map(([country, leagues]) => (
        <div key={country} className="champion-panelCountry-panel">
          <div className="champion-panelCountry-header" onClick={() => toggleCountry(country)}>
            <div className="champion-panelCountry-element">
                <img src={getFlagSrc(country)} alt={`${country} flag`} className="champion-panelCountry-flag" />
                <p className="champion-panelCountry-name">{country}</p>
            </div>
            <span className="panelCountry-toggle-icon">
              {expandedCountries[country] ? '▲' : '▼'}
            </span>
          </div>
          {expandedCountries[country] && (
            <div className="panelCountry-leagues-list">
              {leagues.map((league) => (
                <a
                  key={league.id}
                  href={`/leagues/${league.id}`}
                  className="panelCountry-league-item"
                >
                  <img
                    src={league.imageUrl}
                    alt={league.name}
                    className="panelCountry-league-image"
                  />
                  <p className="panelCountry-league-name">{league.name}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChampionCountry;