import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./AnalysisMonthly.css";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalysisMonthly = ({ bets, initialBank, finalBank }) => {
    const greenBets = bets.filter(bet => bet.isGreen);
    const redBets = bets.filter(bet => !bet.isGreen);

    const totalGreen = greenBets.reduce((sum, bet) => sum + bet.betValue * bet.odd, 0);
    const totalRed = redBets.reduce((sum, bet) => sum + bet.betValue, 0);

    const pieData = {
        labels: ["Ganhos", "Perdas"],
            datasets: [
            {
                data: [totalGreen, totalRed],
                backgroundColor: ["#008a00", "#c70000"],
            },
        ],
    };

    const barData = {
        labels: ["Banca Inicial", "Banca Final"],
        datasets: [
            {
                label: "Valor (R$)",
                data: [initialBank, finalBank],
                backgroundColor: ["#2196F3", "#FFC107"],
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                color: "#d4d4d4",
                    font: {
                        size: 13,
                    },
                },
            },

            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        return `R$ ${value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })}`;
                    },
                },
            },
        },
    };

    const barOptions = {
        responsive: true,
        plugins: {
        legend: {
            position: "top",
            labels: {
                color: "#d4d4d4",
                font: {
                size: 13,
                },
            },
        },
        },
        scales: {
            x: {
                ticks: {
                    color: "#d4d4d4",
                    font: {
                    size: 12,
                    },
                },
                grid: {
                    color: "#444",
                },
            },
            y: {
                ticks: {
                    color: "#d4d4d4",
                    font: {
                    size: 12,
                    },
                },
                grid: {
                    color: "#444",
                },
            },
        },
    };

  return (
    <div className="analysis-monthly">
        <div className="chart-container-graph1">
            <h3>Progresso da Banca</h3>
            <Bar data={barData} options={barOptions} color="#d4d4d4"/>
        </div>
        <div className="chart-container-graph2">
            <h3>Distribuição de Ganhos e Perdas</h3>
            <Pie data={pieData} options={pieOptions} />
        </div>
    </div>
  );
};

export default AnalysisMonthly;
