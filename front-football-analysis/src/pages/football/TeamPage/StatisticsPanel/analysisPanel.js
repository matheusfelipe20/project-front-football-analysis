import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './analysisPanel.css';

const AnalysisPanel = ({ teamId }) => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [averages, setAverages] = useState({
    home: {
      goals: null,
      cards: null,
      corners: null,
    },
    away: {
      goals: null,
      cards: null,
      corners: null,
    },
  });
  const [totals, setTotals] = useState({
    home: {
      goals: null,
      cards: null,
      corners: null,
    },
    away: {
      goals: null,
      cards: null,
      corners: null,
    },
  });
  const [frequencies, setFrequencies] = useState({
    home: {
      goals: { label: 'N/A', color: 'gray' },
      cards: { label: 'N/A', color: 'gray' },
      corners: { label: 'N/A', color: 'gray' },
    },
    away: {
      goals: { label: 'N/A', color: 'gray' },
      cards: { label: 'N/A', color: 'gray' },
      corners: { label: 'N/A', color: 'gray' },
    },
  });
  const [loading, setLoading] = useState(false);

  const requestIdRef = useRef(0);

  const fetchTeamData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://project-football-analysis-1.onrender.com/football/team/${teamId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do time:', error);
      return null;
    }
  }, [teamId]);

  const calculateListFreq = (teamData) => {
    return {
      home: {
        goals: teamData.goalHome,
        cards: teamData.cardsHome,
        corners: teamData.cornerHome,
      },
      away: {
        goals: teamData.goalOut,
        cards: teamData.cardsOut,
        corners: teamData.cornerOut,
      },
    };
  };

  const sumValues = (values) => values.reduce((acc, value) => acc + (value || 0), 0);

  const calculateTotals = useCallback((teamData) => {
    const sumValues = (values) => values.reduce((acc, value) => acc + (value || 0), 0);
  
    return {
      home: {
        goals: sumValues(teamData.goalHome),
        cards: sumValues(teamData.cardsHome),
        corners: sumValues(teamData.cornerHome),
      },
      away: {
        goals: sumValues(teamData.goalOut),
        cards: sumValues(teamData.cardsOut),
        corners: sumValues(teamData.cornerOut),
      },
    };
  }, []);

  const evaluateFrequency = (values) => {
    const recentValues = values.slice(-5);

    if (recentValues.length <= 1) {
      return { label: 'N/A', color: 'gray' }; //Caso haja 1 ou menos valores, não pode avaliar
    }

    const mean = recentValues.reduce((sum, value) => sum + value, 0) / recentValues.length;
    const variance = recentValues.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / recentValues.length;
    const standardDeviation = Math.sqrt(variance);

    const threshold = mean * 0.5;

    if (standardDeviation <= threshold) {
      return { label: 'Constante', color: 'green' };
    } else if (standardDeviation > threshold && standardDeviation <= threshold * 2) {
      return { label: 'Oscilando', color: 'orange' }; 
    } else {
      return { label: 'Inconstante', color: 'red' };
    }
  };

  const updateStatistics = useCallback(async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
  
    const teamData = await fetchTeamData();
  
    if (teamData && currentRequestId === requestIdRef.current) {
      //Calcula totais corretamente
      const totals = calculateTotals(teamData);
      setTotals(totals);
  
      //Calcula e armazena frequências
      const freqData = calculateListFreq(teamData);
      const frequencyData = {
        home: {
          goals: evaluateFrequency(freqData.home.goals),
          cards: evaluateFrequency(freqData.home.cards),
          corners: evaluateFrequency(freqData.home.corners),
        },
        away: {
          goals: evaluateFrequency(freqData.away.goals),
          cards: evaluateFrequency(freqData.away.cards),
          corners: evaluateFrequency(freqData.away.corners),
        },
      };
      setFrequencies(frequencyData);
  
      //Calcula médias
      const tabData = {
        home: {
          goals: teamData.goalHome.length
            ? parseFloat((sumValues(teamData.goalHome) / teamData.goalHome.length).toFixed(2))
            : 0,
          cards: teamData.cardsHome.length
            ? parseFloat((sumValues(teamData.cardsHome) / teamData.cardsHome.length).toFixed(2))
            : 0,
          corners: teamData.cornerHome.length
            ? parseFloat((sumValues(teamData.cornerHome) / teamData.cornerHome.length).toFixed(2))
            : 0,
        },
        away: {
          goals: teamData.goalOut.length
            ? parseFloat((sumValues(teamData.goalOut) / teamData.goalOut.length).toFixed(2))
            : 0,
          cards: teamData.cardsOut.length
            ? parseFloat((sumValues(teamData.cardsOut) / teamData.cardsOut.length).toFixed(2))
            : 0,
          corners: teamData.cornerOut.length
            ? parseFloat((sumValues(teamData.cornerOut) / teamData.cornerOut.length).toFixed(2))
            : 0,
        },
      };
  
      setAverages(tabData);
    }
    setLoading(false);
  }, [fetchTeamData, calculateTotals]);
  

  useEffect(() => {
    updateStatistics();
  }, [selectedTab, updateStatistics]);

  return (
    <div className="panel-statistic">
      <p>Estatísticas do time</p>
      <div className="statistics-tabs">
        <button
          className={selectedTab === 'home' ? 'active' : ''}
          onClick={() => setSelectedTab('home')}
        >
          Casa
        </button>
        <button
          className={selectedTab === 'away' ? 'active' : ''}
          onClick={() => setSelectedTab('away')}
        >
          Fora
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="statistics-summary">
          <div className="statistics-average">
            <h2>Médias</h2>
            <div className="statistic-item">
              <p>Gols</p>
              <p>{averages[selectedTab]?.goals ?? 'N/A'}</p>
            </div>
            <div className="statistic-item">
              <p>Escanteios</p>
              <p>{averages[selectedTab]?.corners ?? 'N/A'}</p>
            </div>
            <div className="statistic-item">
              <p>Cartões</p>
              <p>{averages[selectedTab]?.cards ?? 'N/A'}</p>
            </div>
          </div>

          <div className="statistics-frequency">
            <h2>Frequência</h2>
            <div className="statistic-item">
              <p>Gols</p>
              <p
                style={{ color: frequencies[selectedTab]?.goals.color }}
              >
                {frequencies[selectedTab]?.goals.label}
              </p>
            </div>
            <div className="statistic-item">
              <p>Escanteios</p>
              <p
                style={{ color: frequencies[selectedTab]?.corners.color }}
              >
                {frequencies[selectedTab]?.corners.label}
              </p>
            </div>
            <div className="statistic-item">
              <p>Cartões</p>
              <p
                style={{ color: frequencies[selectedTab]?.cards.color }}
              >
                {frequencies[selectedTab]?.cards.label}
              </p>
            </div>
          </div>

          <div className="statistics-total">
            <h2>Total</h2>
            <div className="statistic-item">
              <p>Gols</p>
              <p>{totals[selectedTab]?.goals ?? 'N/A'}</p>
            </div>
            <div className="statistic-item">
              <p>Escanteios</p>
              <p>{totals[selectedTab]?.corners ?? 'N/A'}</p>
            </div>
            <div className="statistic-item">
              <p>Cartões</p>
              <p>{totals[selectedTab]?.cards ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnalysisPanel.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default AnalysisPanel;
