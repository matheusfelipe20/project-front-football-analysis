import React from "react";
import ChampionshipsRanking from "./Championships/ChampionshipsRanking";
import ChampionCountry from "./ChampionCountry/ChampionCountry";
import MatchList from "./Team/MatchList";

import './FootballHome.css'
import ScoreLive from "./ScoreLive/ScoreLive";
 
const FootballHome = () => (
    <>
    <div className="body-footballHome">
        <div className="panel-footballHome">
            <div className="element-scoreLive">
                <ScoreLive />
            </div>
            <div className="element-matchTeam">
                <MatchList />
            </div>
            <div className="element-componentChampion">
                <ChampionshipsRanking />
                <ChampionCountry />
            </div>
        </div>
    </div>
    </>
);

export default FootballHome;