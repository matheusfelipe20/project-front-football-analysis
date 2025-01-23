import React from "react";
import '../../variables/Colors.css'
import './TableBetPage.css'
import PanelTableBet from "./PanelTableBet/PanelTableBet";
 
const TableBetPage = () => {
    
    return (
        <div className="tableBetPage-body">
            <PanelTableBet />
        </div>
    );
};

export default TableBetPage;