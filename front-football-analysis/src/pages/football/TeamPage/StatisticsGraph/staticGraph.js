import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './staticGraph.css';
import Divider from '../../../../components/divider/divider';

const GraphPanel = ({ teamId }) => {
  const [selectedGraphTab, setSelectedGraphTab] = useState('home');
  const [data, setData] = useState({
    cornerHome: [],
    cornerOut: [],
    cardsHome: [],
    cardsOut: [],
    goalHome: [],
    goalOut: [],
  });

  const fetchGraphData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://project-football-analysis-1.onrender.com/football/team/${teamId}`
      );

      if (response.data) {
        setData({
          cornerHome: response.data.cornerHome.slice(-5),
          cornerOut: response.data.cornerOut.slice(-5),
          cardsHome: response.data.cardsHome.slice(-5),
          cardsOut: response.data.cardsOut.slice(-5),
          goalHome: response.data.goalHome.slice(-5),
          goalOut: response.data.goalOut.slice(-5),
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
    }
  }, [teamId]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const renderGraph = (title, values) => (
    <div className="graph-section">
        <h3>{title}</h3>
        <div className="graph-bars">
            {values.length > 0
            ? values.map((value, index) => (
                <div key={index} className="graph-bar">
                    <div
                    className="bar"
                    style={{ height: `${value * 3}px`, backgroundColor: 'steelblue' }}
                    ></div>
                    <span>{value}</span>
                </div>
                ))
            : Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="graph-bar no-result">
                    <div className="bar empty"></div>
                    <span>N/A</span>
                </div>
                ))}
        </div>
    </div>
  );

  return (
    <div className="panel-graph">
      <p>Gráficos de Estatísticas</p>
      <div className="graph-tabs">
        <div
          className="toggle-container"
          onClick={() => setSelectedGraphTab(selectedGraphTab === 'home' ? 'away' : 'home')}
        >
          <div className={`toggle-slider ${selectedGraphTab === 'home' ? 'home' : 'away'}`}>
            <span>{selectedGraphTab === 'home' ? 'Casa' : 'Fora'}</span>
          </div>
        </div>
      </div>
      <div className="graph-display">
        <div className="graph-divider">
          <Divider width="100%" color="#D7D7D7" height={'1px'} margin={'0px 0px 5px 0px'} />
        </div>
        <h2>Resultados</h2>
        <h4>( últimos 5 jogos )</h4>
        <div className="graph-container">
            {selectedGraphTab === 'home' ? (
            <>
                {renderGraph('Escanteios', data.cornerHome)}
                {renderGraph('Cartões', data.cardsHome)}
                {renderGraph('Gols', data.goalHome)}
            </>
            ) : (
            <>
                {renderGraph('Escanteios', data.cornerOut)}
                {renderGraph('Cartões', data.cardsOut)}
                {renderGraph('Gols', data.goalOut)}
            </>
            )}
        </div>
      </div>
    </div>
  );
};

GraphPanel.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default GraphPanel;
