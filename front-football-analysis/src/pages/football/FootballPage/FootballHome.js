import React from "react";
import CarouselImage from "../../../components/carousel/CarouselImage";
import ChampionshipsRanking from "./Championships/ChampionshipsRanking";
import ChampionCountry from "./ChampionCountry/ChampionCountry";

import './FootballHome.css'
 
const FootballHome = () => (
    <>
    <CarouselImage />
    <div className="body-footballHome">
        <ChampionshipsRanking />
        <ChampionCountry />
    </div>
    </>
);

export default FootballHome;