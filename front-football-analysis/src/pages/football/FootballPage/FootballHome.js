import React from "react";
import ChampionshipsRanking from "./Championships/ChampionshipsRanking";
import ChampionCountry from "./ChampionCountry/ChampionCountry";

import './FootballHome.css'
 
const FootballHome = () => (
    <>
    <div className="body-footballHome">
        <div className="panel-footballHome">
            <div className="element-championRanking">
                <ChampionshipsRanking />
            </div>
            <div className="element-mid">
                <p>Em manutenção</p>
            </div>
            <div className="element-championCountry">
                <ChampionCountry />
            </div>
        </div>
    </div>
    </>
);

export default FootballHome;