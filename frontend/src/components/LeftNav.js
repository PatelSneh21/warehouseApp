import React from 'react'
// We import NavLink to utilize the react router.
import { NavLink, useLocation } from 'react-router-dom'
import { FaHome, FaClipboardList, FaHistory, FaPlus} from 'react-icons/fa';


function LeftNav(props) {

    const {state} = useLocation();

    // const regularColor = {backgroundColor: 'rgb(36, 105, 255)'};

    // const activeColor = {backgroundColor: 'rgb(126, 165, 250)'};
    console.log(state);
    return (
        <div className="left-rect">
            <h3 className="navTitle">BlueVue</h3>
            <div className='left-inner'>
                    <nav>
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home" state={{user:state.user}}>
                            <FaHome className='icon' /> Home
                        </NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/inventory" state={{user:state.user}}>
                            <FaClipboardList className='icon' />Inventory
                        </NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/history" state={{user:state.user}}>
                            <FaHistory className='icon'/> History</NavLink>
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/addItem" state={{user:state.user}}>
                            <FaPlus className='icon'/> Add Item</NavLink>
                    </nav>
                        
                      
            </div>
        </div>
    )
}

export default LeftNav
