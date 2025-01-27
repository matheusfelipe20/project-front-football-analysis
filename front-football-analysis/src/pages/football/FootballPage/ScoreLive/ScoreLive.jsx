import React from "react";
import "./ScoreLive.css";
import Divider from "../../../../components/divider/divider";

import iconLive from "../../../../assets/icons/icon-live.svg";
import logoTeamDefault from "../../../../assets/team/default/logo-default.png";

const ScoreLive = () => {
    
  return (
    <div className="score-live">
        <h2>Jogo em Destaque</h2>
        <Divider width="100%" color="#e1e1e1" height={"2px"} margin={"0px"} />
        <div className="score-live-text">
            <img src={iconLive} alt="icone ao vivo"/>
            <p>Ao vivo</p>
        </div>
        <div className="panel-team-score">
            <div className="score-team">
                <img src={logoTeamDefault} alt="logo time padrão"/>
                <p>Time AB</p>
            </div>
            <div className="panel-score-game">
                <div className="score-game">
                    <p>1</p>
                    <p>x</p>
                    <p>1</p>
                </div>
                <p className="score-time">2º tempo</p>
            </div>
            <div className="score-team">
                <img className="score-logo-team" src={logoTeamDefault} alt="logo time padrão"/>
                <p>Time CD</p>
            </div>
        </div>

    </div>
  );
};

export default ScoreLive;