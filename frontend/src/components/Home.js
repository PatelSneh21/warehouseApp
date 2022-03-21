import React from 'react'
// We use Route in order to define the different routes of our application
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
  Switch,
  Outlet,
  useLocation
} from "react-router-dom";
import LeftNav from './LeftNav';


function Home(props) {

  const {state} = useLocation();
  console.log(state);
  return (
    <div>


      <div className="home-container">
        <div className="sidebar">
          <LeftNav />
          
        </div>
        <div className="home-content">
          <h1>Bluevue Warehouse Manager</h1>
          <h2> Welcome, <span>{state.user.email}</span></h2>
            
            <div className="content">
              <Outlet />
            </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home