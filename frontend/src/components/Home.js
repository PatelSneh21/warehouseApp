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
import TopBar from './TopBar';


function Home(props) {
  return (
    <div>
      <div className="home-container">
        <div className="sidebar">
          <LeftNav />
        </div>
        <div className="home-content">
          <TopBar />
          
            
            <div className="content">
              <Outlet />
            </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home