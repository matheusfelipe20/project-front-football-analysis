import React, { useState } from "react";
import axios from "axios";
import './headerSearch.css'

import iconSearch from '../../../assets/icons/icon-search.svg'

const HeaderSearch = () => {
    const [query, setQuery] = useState(""); // Entrada do usuário
    const [teams, setTeams] = useState([]); // Resultados da pesquisa
    const [showDropdown, setShowDropdown] = useState(false); // Controle do dropdown

    const handleInputChange = async (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 0) {
            try {
                const response = await axios.get(
                    `https://project-football-analysis-1.onrender.com/team/search`,
                    { params: { name: value } }
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
            <input
                type="text"
                className="search-input"
                placeholder="Pesquisar times..."
                value={query}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(query.length > 0)} // Mostra dropdown ao focar
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Fecha dropdown após desfocar
            />
            <button className="search-button">
                <img src={iconSearch} alt="Ícone de lupa" />
            </button>

            {showDropdown && teams.length > 0 && (
                <ul className="search-dropdown">
                    {teams.map((team) => (
                        <li key={team.id} className="dropdown-item">
                            {team.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HeaderSearch;
