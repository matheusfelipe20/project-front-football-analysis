import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './infoCrud.css';
import Divider from '../../../../components/divider/divider';
import iconSuccess from "../../../../assets/icons/icon-success.svg";
import iconError from "../../../../assets/icons/icon-error.svg";
import { useDataUpdate } from "../../../../components/updateContext/useDataUpdate.jsx";

const InfoCrud = ({ teamId }) => {
  const [selectedCategory, setSelectedCategory] = useState('corner');
  const [selectedLocation, setSelectedLocation] = useState('home');
  const [selectedTable, setSelectedTable] = useState('cornerHome');
  const [value, setValue] = useState('');
  const [apiStatus, setApiStatus] = useState(null);
  const [data, setData] = useState({});
  const [editValue, setEditValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableCollapsed, setIsTableCollapsed] = useState(true);
  const { triggerUpdate } = useDataUpdate();

  const tableNames = {
    cornerHome: 'Escanteios - Casa',
    cornerOut: 'Escanteios - Fora',
    goalHome: 'Gol - Casa',
    goalOut: 'Gol - Fora',
    cardsHome: 'Cartão - Casa',
    cardsOut: 'Cartão - Fora',
  };

  const loadData = useCallback(async () => {
    try {
      const response = await axios.get(`https://project-football-analysis-1.onrender.com/football/team/${teamId}`);
      setData(response.data);
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Erro ao carregar os dados.' });
    }
  }, [teamId]);

  //O useEffect carrega os dados apenas uma vez, quando o componente é montado
  useEffect(() => {
    loadData();
  }, [loadData]);

  const addValue = async () => {
    try {
      const categoryName = `${selectedCategory}${selectedLocation === 'home' ? 'Home' : 'Out'}`;
      await axios.post(
        `https://project-football-analysis-1.onrender.com/football/team/${teamId}/${categoryName}`,
        parseInt(value),
        { headers: { 'Content-Type': 'application/json' } }
      );
      setApiStatus({ type: 'success', message: 'Adicionado com sucesso!' });
      setValue('');
      triggerUpdate(true);
      loadData();
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Erro ao adicionar o valor.' });
    }
  };

  const updateValue = async () => {
    try {
      await axios.put(
        `https://project-football-analysis-1.onrender.com/football/team/${teamId}/${selectedTable}/${editIndex}`,
        JSON.stringify(editValue),
        { headers: { 'Content-Type': 'application/json' } }
      );
      setApiStatus({ type: 'success', message: 'Editado com sucesso!' });
      setEditValue('');
      setEditIndex(null);
      triggerUpdate(true);
      loadData();
    } catch (error) {
      setApiStatus({ type: 'error', message: 'Erro ao editar o valor.' });
    }
  };

  const confirmRemoveValue = async (index) => {
    const confirmRemoval = window.confirm("Você tem certeza que deseja remover este valor?");
    if (confirmRemoval) {
      try {
        await axios.delete(
          `https://project-football-analysis-1.onrender.com/football/team/${teamId}/${selectedTable}/${index}`
        );
        setApiStatus({ type: 'success', message: 'Removido com sucesso!' });
        triggerUpdate(true);
        loadData();
      } catch (error) {
        setApiStatus({ type: 'error', message: 'Erro ao remover o valor.' });
      }
    }
  };

  const itemsPerPage = 5;
  const categoryData = data[selectedTable] || [];
  const pageCount = Math.ceil(categoryData.length / itemsPerPage);
  const paginatedData = categoryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCloseApiStatus = () => {
    setApiStatus(null);
  };

  //Usado para fechar a mensagem de Sucesso/Erro automaticamente após x segundos
  useEffect(() => {
    if (apiStatus) {
      const timer = setTimeout(() => {
        setApiStatus(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [apiStatus]);

  return (
    <div className="graph-panel">
      <h1>Gerenciador de Estatísticas</h1>
      <div className="add-value">
            <div className="add-value-header">
                <h2>Adicionar Valor</h2>
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="select-add-value-category">
                    <option value="corner">Escanteio</option>
                    <option value="cards">Cartão</option>
                    <option value="goal">Gol</option>
                </select>
                <select onChange={(e) => setSelectedLocation(e.target.value)} value={selectedLocation} className="select-add-value-location">
                    <option value="home">Casa</option>
                    <option value="out">Fora</option>
                </select>
                </div>
                <Divider width="100%" color="#e0e0e0" height={'1px'} margin={'0px'} />
                <div className="add-value-input">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Valor"
                />
                <button onClick={addValue}>Adicionar</button>
            </div>
      </div>

      <div className="edit-remove-values">
        <div className="edit-remove-values-header">
            <h2>Gerenciar Tabelas</h2>
            <select onChange={(e) => setSelectedTable(e.target.value)} value={selectedTable} className="select-edit-remove-values-table">
                {Object.keys(tableNames).map((key) => (
                    <option key={key} value={key}>
                    {tableNames[key]}
                    </option>
                ))}
            </select>
        </div>
        <Divider width="100%" color="#e0e0e0" height={'1px'} margin={'0px'} />
        <div className="edit-remove-values-table">
            <div className="edit-remove-values-table-title">
                <h3>{tableNames[selectedTable]}</h3>
                <button onClick={() => setIsTableCollapsed(!isTableCollapsed)}>
                {isTableCollapsed ? 'Maximizar' : 'Minimizar'}
                </button>
            </div>
            {!isTableCollapsed && paginatedData.length > 0 ? (
            <table>
                <thead>
                <tr>
                    <th className="table-team-title">Valor</th>
                    <th className="table-team-title">Ações</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((item, index) => (
                    <tr key={index}>
                    <td className="table-team-result">{item}</td>
                    <td className="table-team-action">
                        <button
                        onClick={() => {
                            setEditIndex(index + (currentPage - 1) * itemsPerPage);
                            setEditValue(item);
                        }}
                        className="table-team-edit-button">
                        Editar
                        </button>
                        <button onClick={() => confirmRemoveValue(index + (currentPage - 1) * itemsPerPage)} className="table-team-remove-button">Remover</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : isTableCollapsed ? (
            <p className="table-text-mini">Tabela minimizada</p>
            ) : (
            <p className="table-text-mini">Sem dados</p>
            )}

            {pageCount > 1 && !isTableCollapsed && (
            <div className="pagination">
                <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                className="pagination-arrow"
                >
                {'<'}
                </button>
            
                {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className="pagination-number">
                    {currentPage - 1}
                </button>
                )}
                <button className="pagination-number active">{currentPage}</button>
                {currentPage < pageCount && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className="pagination-number">
                    {currentPage + 1}
                </button>
                )}
            
                <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
                className="pagination-arrow"
                >
                {'>'}
                </button>
            </div>
            )}
        </div>

        {editIndex !== null && (
            <div className="edit-popup">
                <h3>Editar Valor</h3>
                <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Novo valor"
                />
                <div className="edit-popup-actions">
                    <button onClick={updateValue} className="edit-popup-button-confirmation">Confirmar</button>
                    <button onClick={() => setEditIndex(null)} className="edit-popup-button-cancel">Cancelar</button>
                </div>
            
            </div>
        )}

        {apiStatus && (
            <div className={`api-status-message ${apiStatus.type}`}>
            <img
                src={apiStatus.type === "success" ? iconSuccess : iconError}
                alt={apiStatus.type}
                className="status-icon"
            />
            <p>{apiStatus.message}</p>
            <button className="close-button" onClick={handleCloseApiStatus}>
                ×
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoCrud;
