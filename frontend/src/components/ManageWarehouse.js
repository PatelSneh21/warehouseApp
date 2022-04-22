import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";



function ManageWarehouse() {
    const navigate = useNavigate();
    const {state} = useLocation();
    function handleClick(path) {
        navigate(path, {replace:true, state: state});
    }

    return ( 
        <div className="create-content">
          <h2>Add/Edit Company Warehouse Information</h2>
          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("bins")}
              >
                Bin Locations
              </Button>
            </div>
          </div>

          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("racks")}
              >
                Rack Locations
              </Button>
            </div>
          </div>

          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("customers")}
              >
                Customer Details
              </Button>
            </div>
          </div>

          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("items")}
              >
                Item Models
              </Button>
            </div>
          </div>

          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("cartons")}
              >
                Master Carton Information
              </Button>
            </div>
          </div>

          <div className="result-card">
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" size="lg"
                onClick={() => handleClick("users")}
              >
                User Accounts
              </Button>
            </div>
          </div>
        </div>
        
      )
}

export default ManageWarehouse;

