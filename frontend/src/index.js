import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import HistorySummary from './components/HistorySummary';
import SalesSummary from './components/SalesSummary';
import Home from './components/Home';
import HomeContent from './components/HomeContent';
import HistoryPage from './components/HistoryPage';
import SalesPage from './components/SalesPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />


      <Route path="home" element={<Home />}>
        <Route index element={<HomeContent />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="sales" element={<SalesPage />} />
      </Route>

      {/* <Route path="home" element={<Home />} />
      <Route path="history" element={<HistorySummary />} />
      <Route path="sales" element={<SalesSummary />} /> */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
