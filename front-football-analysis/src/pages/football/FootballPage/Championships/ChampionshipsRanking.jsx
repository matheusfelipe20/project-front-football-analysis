import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ChampionshipsRanking.css";
import Divider from "../../../../components/divider/divider";
import "../../../../variables/Colors.css"

const ChampionshipsRanking = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch('https://project-football-analysis-1.onrender.com/football/league');
        const data = await response.json();
        const randomLeagues = getRandomLeagues(data, 10);
        setLeagues(randomLeagues);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar as ligas:', error);
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const getRandomLeagues = (allLeagues, numberOfLeagues) => {
    const shuffled = [...allLeagues].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfLeagues);
  };

  return (
    <div className="championships-ranking">
      <h2>Campeonatos em Destaques</h2>
      <Divider width="100%" color="#e1e1e1" height={"2px"} margin={"0px"} />
      <div className="championships-list">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div className="championships-item" key={index}>
              <div className="skeleton-placeholder"></div>
              <div className="skeleton-name"></div>
            </div>
          ))
        ) : (
          leagues.map((league) => (
            <div className="championships-item" key={league.id}>
              <Link to={`/football/league/${league.id}`} className="championships-link">
                <img src={league.imageUrl} alt={league.name} className="championships-image" />
                <p className="championships-name">{league.name}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChampionshipsRanking;
