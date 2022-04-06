import React from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import { FaUserCircle, FaBell, FaLongArrowAltUp } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
  



function TopBar() {
    const {state} = useLocation();

    function logout(e) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = '/';
    }



  return (
    <div className='topbar-wrapper'>

    <div class="top-bar">
        <div class="top-padding">
            <div className='top-name'> BlueVue Warehouse Manager </div>
        </div>
      
        <div class="top-user">
        
        <Dropdown>
          <Dropdown.Toggle variant="" id="">
            {/* <FaBell className='user-icon' /> */}
            <FaUserCircle className='user-icon' /> {state.user.email}
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>

        
    </div>


        


    </div>
  )
}

export default TopBar