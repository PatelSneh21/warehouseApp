import React from 'react'
// We import NavLink to utilize the react router.
import { NavLink, useLocation } from 'react-router-dom'


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
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} to="/home" state={{user:state.user}}>Home</NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} to="/home/history" state={{user:state.user}}>History</NavLink> 
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} to="/home/sales" state={{user:state.user}}>Sales</NavLink>
                    </nav>
                        
                      
            </div>
        </div>
    )
}

export default LeftNav
