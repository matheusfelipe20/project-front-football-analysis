import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './analysisPanel.css';
import Divider from '../../../../components/divider/divider';

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
      return { label: 'N/A', color: 'gray' };
    }
  
    const differences = recentValues.slice(1).map((value, index) => Math.abs(value - recentValues[index]));
  
    const meanDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  
    const threshold = 2.2;
  
    if (meanDifference <= threshold) {
      return { label: 'Consistente', color: 'green' };
    } else {
      return { label: 'Oscilando', color: 'orange' };
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
        <div className="toggle-container" onClick={() => setSelectedTab(selectedTab === 'home' ? 'away' : 'home')}>
          <div className={`toggle-slider ${selectedTab === 'home' ? 'home' : 'away'}`}>
            <span>{selectedTab === 'home' ? 'Casa' : 'Fora'}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="statistics-loading">Carregando...</p>
      ) : (
        <div className="statistics-summary">
          <div className="statistic-divider"> <Divider width='100%' color='#D7D7D7' height={'1px'} margin={'0px 0px 5px 0px'}/> </div>
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
          <div className="statistic-divider"> <Divider width='60%' color='#D7D7D7' height={'1px'} margin={'10px 0px 0px 0px'}/> </div>
          <div className="statistics-frequency">
            <h2>Frequência</h2>
            <div className="statistic-item">
              <p>Gols</p>
              <p className="statistic-freq"
                style={{ color: frequencies[selectedTab]?.goals.color, fontSize: '0.9rem' }}
              >
                {frequencies[selectedTab]?.goals.label}
              </p>
            </div>
            <div className="statistic-item">
              <p>Escanteios</p>
              <p className="statistic-freq"
                style={{ color: frequencies[selectedTab]?.corners.color, fontSize: '0.9rem' }}
              >
                {frequencies[selectedTab]?.corners.label}
              </p>
            </div>
            <div className="statistic-item">
              <p>Cartões</p>
              <p className="statistic-freq"
                style={{ color: frequencies[selectedTab]?.cards.color, fontSize: '0.9rem' }}
              >
                {frequencies[selectedTab]?.cards.label}
              </p>
            </div>
          </div>
          <div className="statistic-divider"> <Divider width='60%' color='#D7D7D7' height={'1px'} margin={'10px 0px 0px 0px'}/> </div>
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
