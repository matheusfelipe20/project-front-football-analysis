import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './PanelTableBet.css';

import iconFilter from "../../../assets/icons/icon-filter.svg";

const monthsInPortuguese = {
    "january": "Janeiro",
    "february": "Fevereiro",
    "march": "Março",
    "april": "Abril",
    "may": "Maio",
    "june": "Junho",
    "july": "Julho",
    "august": "Agosto",
    "september": "Setembro",
    "october": "Outubro",
    "november": "Novembro",
    "december": "Dezembro",
};

const PanelTableBet = () => {
    const [tables, setTables] = useState([]);
    const [filteredYear, setFilteredYear] = useState("Exibir Todos");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://project-football-analysis-1.onrender.com/api/monthly-tables/list`)
            .then(response => {
                const formattedTables = response.data.map(item => {
                    const [month, year] = item[1].split("/");
                    return {
                        id: item[0],
                        month: monthsInPortuguese[month] || month,
                        year,
                    };
                });
                setTables(formattedTables);
            })
            .catch(error => console.error("Error fetching tables:", error));
    }, []);

    const handleTableClick = (tableId) => {
        navigate(`dashbord/${tableId}`);
    };

    const years = ["Exibir Todos", ...new Set(tables.map(table => table.year))];

    return (
        <div className="tableBet-body">
            <div className="tableBet-panel">
                <h1>Tabelas de Gestão</h1>
                <h4>A cada mês uma nova tabela é criada automaticamente para manter sua gestão ativa.</h4>
                <div className="filter-container">
                    <div className="filter-text">
                        <label htmlFor="yearFilter">Filtro</label>
                        <img className="tableBet-iconfilter" src={iconFilter} alt="icone filtro" />
                    </div>
                    <select 
                        id="yearFilter" 
                        value={filteredYear} 
                        onChange={(e) => setFilteredYear(e.target.value)}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {years.filter(year => year !== "Todos" || filteredYear === "Todos").map(year => (
                    <div key={year} className="year-section">
                        {(filteredYear === "Exibir Todos" || filteredYear === year) && (
                            <>
                                {year !== "Exibir Todos" && <h2>{`-${year}`}</h2>}
                                <div className="table-buttons">
                                    {tables.filter(table => table.year === year).map(table => (
                                        <button 
                                            key={table.id}
                                            className="table-button" 
                                            onClick={() => handleTableClick(table.id)}
                                        >
                                            {table.month}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PanelTableBet;
