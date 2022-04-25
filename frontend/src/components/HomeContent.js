import React from 'react'
import SalesSummary from './SalesSummary';
import HistorySummary from './HistorySummary';
import Alerts from './Alerts';
import PurchasesSummary from './PurchasesSummary';
import MonthSummary from './MonthSummary';

function HomeContent() {
  return (
    <div className="home-content-container">
        <div className="month-grid">
            <MonthSummary />
        </div>
        
        <div className="alerts-grid">
            <Alerts/>
        </div>
        <div className="sales-grid">
            <SalesSummary />
        </div>
        <div className="purchases-grid">
            <PurchasesSummary />
        </div>
{/*         
        <div className="history-grid">
            <HistorySummary/>
        </div> */}
    </div>
            
  )
}

export default HomeContent