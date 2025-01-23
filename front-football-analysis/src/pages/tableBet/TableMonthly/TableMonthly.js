import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TableMonthly.css";

import iconEdit from "../../../assets/icons/icon-edit.svg";
import iconAdd from "../../../assets/icons/icon-add.svg";
import iconRemoveBet from "../../../assets/icons/icon-remove.svg";
import iconEditBet from "../../../assets/icons/icon-edit2.svg";
import AnalysisMonthly from "./AnalysisMonthly/AnalysisMonthly";


const BASE_URL = "https://project-football-analysis-1.onrender.com/api/monthly-tables";

const TableMonthly = () => {
    const { tablemonthlyId } = useParams();
    const [table, setTable] = useState(null);
    const [bets, setBets] = useState([]);
    const [editBet, setEditBet] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showEditBetPopup, setShowEditBetPopup] = useState(false);
    const [newBet, setNewBet] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const betsPerPage = 5;

    const refreshTableData = useCallback(() => {
        axios.get(`${BASE_URL}/list/${tablemonthlyId}`)
            .then((response) => setTable(response.data))
            .catch((error) => console.error("Error refreshing table details:", error));
    
        axios.get(`${BASE_URL}/bets/${tablemonthlyId}`)
            .then((response) => setBets(response.data))
            .catch((error) => console.error("Error refreshing bets:", error));
    }, [tablemonthlyId]);
    
    useEffect(() => {
        refreshTableData();
    }, [refreshTableData]);

    const handleEditTable = (updatedTable) => {
        axios.put(`${BASE_URL}/${tablemonthlyId}/edit`, updatedTable)
            .then(() => {
                setTable({ ...table, ...updatedTable });
                setShowEditPopup(false);
            })
            .catch(error => console.error("Error updating table:", error));
    };

    const handleAddBet = () => {
        axios
        .post(`${BASE_URL}/bets/${tablemonthlyId}`, newBet)
        .then(() => {
            refreshTableData();
            setNewBet(null);
        })
        .catch((error) => console.error("Error adding bet:", error));
    };

    const handleEditBet = (betId, updatedBet) => {
        axios.put(`${BASE_URL}/bets/${betId}`, updatedBet)
            .then(() => {
                setBets(bets.map(bet => bet.id === betId ? { ...bet, ...updatedBet } : bet));
                refreshTableData();
                setShowEditBetPopup(false);
            })
            .catch(error => console.error("Error editing bet:", error));
    };

    const handleRemoveBet = (betId) => {
        if (window.confirm("Are you sure you want to remove this bet?")) {
            axios.delete(`${BASE_URL}/bets/${betId}`)
                .then(() => {
                    setBets(bets.filter(bet => bet.id !== betId));
                    refreshTableData();
                })
                .catch(error => console.error("Error removing bet:", error));
        }
    };

    const indexOfLastBet = currentPage * betsPerPage;
    const indexOfFirstBet = indexOfLastBet - betsPerPage;
    const currentBets = bets.slice(indexOfFirstBet, indexOfLastBet);
    const totalPages = Math.ceil(bets.length / betsPerPage);

    return (
        <div className="table-monthly">
            <div className="table-monthly-painel">
                <div className="table-monthly-title">
                    <h1>Gestão Dashboard</h1>
                    <button onClick={() => setShowEditPopup(true)}>
                        <img className="table-monthly-icon" src={iconEdit} alt="icon editar" />
                    </button>
                </div>
                {showEditPopup && (
                    <div className="popup-editTableMonthly">
                        <h2>Configurar Tabela</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const updatedTable = {
                                    initialBank: parseFloat(e.target.initialBank.value),
                                    entryPercentage: parseFloat(e.target.entryPercentage.value),
                                };

                                //Validação
                                if (updatedTable.initialBank === 0 || updatedTable.entryPercentage === 0) {
                                    alert("Os valores não podem ser 0!");
                                } else {
                                    handleEditTable(updatedTable);
                                    setShowEditPopup(false);
                                }
                            }}
                        >
                            <div className="input-editTableMonthly">
                                <div className="label-editTableMonthly">
                                    <label>Banca Inicial</label>
                                    <label className="label-text-editTableMonthly">(apenas valor acima de 0)</label>
                                </div>
                                <input type="number" name="initialBank" defaultValue={table?.initialBank || 0} required/>
                            </div>
                            <div className="input-editTableMonthly">
                                <div className="label-editTableMonthly">
                                    <label>Percentual de Entrada</label>
                                    <label className="label-text-editTableMonthly">(de 0 a 100%)</label>
                                </div>
                                <input type="number" name="entryPercentage" defaultValue={table?.entryPercentage || 0} required/>
                            </div>
                            <div className="popup-actions">
                                <button type="submit">Salvar</button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            parseFloat(table?.initialBank) === 0 ||
                                            parseFloat(table?.entryPercentage) === 0
                                        ) {
                                            alert("Você não pode fechar o popup com os valores vazios ou 0!");
                                        } else {
                                            setShowEditPopup(false);
                                        }
                                    }}
                                >
                                    Fechar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {table && (
                    <div className="table-bet-monthly">
                        <p>Banca inicial de R${table.initialBank}.00</p>
                        <p>-</p>
                        <p>Entrada mínima de {table.entryPercentage}%</p>
                    </div>
                )}

                {showEditBetPopup && (
                    <div className="popup-addBetMonthly">
                        <h2>Editar Aposta</h2>
                        <form onSubmit={(e) => {e.preventDefault(); handleEditBet(editBet.id, editBet); setShowEditBetPopup(false);}}>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Valor da Aposta</label>
                                    <label className="label-text-editTableMonthly">( R$ )</label>
                                </div>
                                <input type="number" value={editBet.betValue} onChange={(e) => setEditBet({ ...editBet, betValue: parseFloat(e.target.value) })} required />
                            </div>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Valor da Odd</label>
                                </div>
                                <input type="number" value={editBet.odd} onChange={(e) => setEditBet({ ...editBet, odd: parseFloat(e.target.value) })} required />
                            </div>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Resultado</label>
                                    <label className="label-text-editTableMonthly">( Green / Red )</label>
                                </div>
                                <select value={editBet.isGreen} onChange={(e) => setEditBet({ ...editBet, isGreen: e.target.value === "true" })}>
                                    <option value="true">Green</option>
                                    <option value="false">Red</option>
                                </select>
                            </div>
                            <div className="popup-actions">
                                <button type="submit">Adicionar</button>
                                <button type="button" onClick={() => setShowEditBetPopup(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
                <div className="bets-monthly">
                    <div className="bets-monthly-title">
                        <h2>Apostas / Bets</h2>
                        <button className="bets-add-monthly" onClick={() => setNewBet({ betValue: "", odd: "", isGreen: true })}>
                            <img className="table-monthly-icon" src={iconAdd} alt="icon adicionar" />
                        </button>
                    </div>
                    
                    <ul className="bets-list">
                        {currentBets.map(bet => (
                            <li key={bet.id} className={bet.isGreen ? "green" : "red"}>
                                <div className="bets-list-painel">
                                    <div className="bets-list-dash">
                                        <p className="bets-list-betValue">Entrada de R$ {bet.betValue}</p>
                                        <p className="bets-list-text"></p>
                                        <p className="bets-list-odd">Odd {bet.odd}</p>
                                        <p className="bets-list-text"></p>
                                        <p className="bets-list-betReturn">
                                            + R$ {bet.isGreen ? (bet.betValue * bet.odd).toFixed(2) : "0.00"}
                                        </p>
                                    </div>
                                    <div className="bets-list-date">
                                    <p>
                                        {`${new Date(bet.createdAt).toLocaleDateString("pt-BR")} às ${new Date(bet.createdAt).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`}
                                    </p>
                                    </div>
                                </div>
                                <div className="bets-list-actions">
                                    <button onClick={() => { setEditBet(bet); setShowEditBetPopup(true); }}>
                                        <img className="table-monthly-icon" src={iconEditBet} alt="icon editar" />
                                    </button>
                                    <button onClick={() => handleRemoveBet(bet.id)}>
                                        <img className="table-monthly-icon" src={iconRemoveBet} alt="icon remove" />
                                    </button>
                                </div>
                            </li>
                        ))}

                        {Array.from({ length: betsPerPage - currentBets.length }).map((_, index) => (
                            <li key={`empty-${index}`} className="empty">
                                <div className="bets-list-painel">
                                    <div className="bets-list-dash">
                                        <p className="bets-list-betValue">---</p>
                                        <p className="bets-list-text-empty"></p>
                                        <p className="bets-list-odd">---</p>
                                        <p className="bets-list-text-empty"></p>
                                        <p className="bets-list-betReturn">
                                            ---
                                        </p>
                                    </div>
                                    <div className="bets-list-date-empty">
                                        <p>
                                            00/00/00 ás 00:00
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>{'<'}</button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>{'>'}</button>
                    </div>
                </div>
                {newBet && (
                    <div className="popup-addBetMonthly">
                        <h2>Adicionar Aposta</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddBet();
                        }}>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Valor da Aposta</label>
                                    <label className="label-text-editTableMonthly">( R$ )</label>
                                </div>
                                <input type="number" value={newBet.betValue} onChange={(e) => setNewBet({ ...newBet, betValue: parseFloat(e.target.value) })} required />
                            </div>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Valor da Odd</label>
                                </div>
                                <input type="number" value={newBet.odd} onChange={(e) => setNewBet({ ...newBet, odd: parseFloat(e.target.value) })} required />
                            </div>
                            <div className="input-addBetMonthly">
                                <div className="label-addBetMonthly">
                                    <label>Resultado</label>
                                    <label className="label-text-editTableMonthly">( Green / Red )</label>
                                </div>
                                <select value={newBet.isGreen} onChange={(e) => setNewBet({ ...newBet, isGreen: e.target.value === "true" })}>
                                    <option value="true">Green</option>
                                    <option value="false">Red</option>
                                </select>
                            </div>
                            <div className="popup-actions">
                                <button type="submit">Adicionar</button>
                                <button type="button" onClick={() => setNewBet(null)}>Fechar</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <div>
                <AnalysisMonthly bets={bets} initialBank={table?.initialBank || 0} finalBank={table?.finalBank || 0} />
            </div>
        </div> 
    );
};

export default TableMonthly;
