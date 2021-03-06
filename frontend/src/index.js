import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import reportWebVitals from './reportWebVitals';
import Home from './components/Home';
import HomeContent from './components/HomeContent';
import HistoryPage from './components/HistoryPage';
import InventoryPage from './components/InventoryPage';
import AddItem from './components/AddItem';
import ManageWarehouse from './components/ManageWarehouse';
import AddTransaction from './components/AddTransaction';
import ManageBins from './components/ManageBins';
import ManageRacks from './components/ManageRacks';
import ManageCartons from './components/ManageCartons';
import ManageCustomers from './components/ManageCustomers';
import ManageUsers from './components/ManageUsers';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.js';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="home" element={<Home />}>
        <Route index element={<HomeContent />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="addItem" element={<AddTransaction />} />
        <Route path="manage/items" element={<AddItem />} />
        <Route path="manage/bins" element={<ManageBins />} />
        <Route path="manage/racks" element={<ManageRacks />} />
        <Route path="manage/customers" element={<ManageCustomers />} />
        <Route path="manage/cartons" element={<ManageCartons />} />
        <Route path="manage/users" element={<ManageUsers />} />
        <Route path="manage" element={<ManageWarehouse />} />
      </Route>

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
