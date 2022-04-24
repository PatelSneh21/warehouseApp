import React, {useState, useEffect} from 'react'
// We import NavLink to utilize the react router.
import { NavLink, useLocation } from 'react-router-dom'
import { FaWrench, FaHome, FaClipboardList, FaHistory, FaPlus} from 'react-icons/fa';


function LeftNav(props) {

    const {state} = useLocation();

    // const regularColor = {backgroundColor: 'rgb(36, 105, 255)'};

    // const activeColor = {backgroundColor: 'rgb(126, 165, 250)'};
    

    let userData = {
        "username" : state.user.email
    }

    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/checkPrivilages',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
           setAdmin(data.isAdmin);
        //setAdmin(true);
        })
        .catch(error => console.log(error));
    }, []);


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
                            <FaPlus className='icon'/> New Transaction</NavLink>

                        {isAdmin &&
                        <NavLink className={(navData) => (navData.isActive ? "navItem-active" : 'navItem')} end to="/home/manage" state={{user:state.user}}>
                            <FaWrench className='icon'/> Manage</NavLink>
                        }
                        
                    </nav>
                        
                      
            </div>
        </div>
    )
}

export default LeftNav
