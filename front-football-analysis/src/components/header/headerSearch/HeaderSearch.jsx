import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import './headerSearch.css';
import iconSearch from '../../../assets/icons/icon-search.svg'
import countries from "../../../assets/icons/country/countries.json";  // Importe o arquivo de países

const HeaderSearch = () => {
    const [query, setQuery] = useState("");
    const [teams, setTeams] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Função para garantir que a primeira letra seja maiúscula
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleInputChange = async (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 0) {
            try {
                const formattedQuery = capitalizeFirstLetter(value);

                const response = await axios.get(
                    `https://project-football-analysis-1.onrender.com/football/team/search`,
                    { params: { name: formattedQuery } }
                );
                setTeams(response.data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Erro ao buscar times:", error);
                setTeams([]);
            }
        } else {
            setTeams([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="header-search">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Pesquisar"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(query.length > 0)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <img src={iconSearch} alt="Ícone de busca" className="search-icon" />
            </div>
            {showDropdown && teams.length > 0 && (
                <ul className="search-dropdown">
                    {teams.map((team) => {
                        const countryCode = Object.keys(countries).find(
                            (key) => countries[key] === team.league.country
                        );
                        const flagSrc = countryCode ? require(`../../../assets/icons/country/${countryCode.toLowerCase()}.svg`) : null;

                        return (
                            <li key={team.id} className="dropdown-item">
                                <Link to={`football/team/${team.id}`} className="team-link">
                                    <img src={team.imageUrl} alt={team.teamName} className="team-image" />
                                    <div className="team-details">
                                        <span className="team-name">{team.teamName}</span>
                                        <div className="team-country">
                                            {team.league?.country && (
                                                <span className="league-country">
                                                    {flagSrc && (
                                                        <img
                                                            src={flagSrc}
                                                            alt={`${team.league.country} flag`}
                                                            className="country-flag"
                                                        />
                                                    )}
                                                    {team.league.country}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default HeaderSearch;
