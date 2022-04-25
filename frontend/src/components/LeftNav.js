import React, {useState, useEffect} from 'react'
// We import NavLink to utilize the react router.
import { NavLink, useLocation } from 'react-router-dom'
import { FaWrench, FaHome, FaClipboardList, FaHistory, FaPlus} from 'react-icons/fa';


function LeftNav(props) {

    const {state} = useLocation();

    // const regularColor = {backgroundColor: 'rgb(36, 105, 255)'};

    // const activeColor = {backgroundColor: 'rgb(126, 165, 250)'};
    

    let userData = {
        "username" : state.username
    }

    const isAdmin = state.isAdmin;
    //const [isAdmin, setAdmin] = useState(false);


    return (
        <div className="left-rect">
            <h3 className="navTitle">BlueVue</h3>
            <div className='left-inner'>
                    <nav>
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home" state={state}>
                            <FaHome className='icon' /> Home
                        </NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/inventory" state={state}>
                            <FaClipboardList className='icon' />Inventory
                        </NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/history" state={state}>
                            <FaHistory className='icon'/> History</NavLink>
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/addItem" state={state}>
                            <FaPlus className='icon'/> New Transaction</NavLink>

                        {isAdmin &&
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/manage" state={state}>
                            <FaWrench className='icon'/> Manage</NavLink>
                        }
                        
                    </nav>
                        
                      
            </div>
        </div>
    )
}

export default LeftNav
