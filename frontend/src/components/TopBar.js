import React from 'react'
import {
    useLocation
  } from "react-router-dom";
  import { FaUserCircle, FaBell } from 'react-icons/fa';


function TopBar() {
    const {state} = useLocation();
  return (
    <div className='topbar-wrapper'>

    <div class="top-bar">
        <div class="top-padding">
            <div className='top-name'> BlueVue Warehouse Manager </div>
        </div>
      
        <div class="top-user">
        <FaBell className='user-icon' />
        <FaUserCircle className='user-icon' /> {state.user.email}
        </div>
    </div>


        


    </div>
  )
}

export default TopBar