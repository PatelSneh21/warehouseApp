import React, {useState, useEffect} from 'react'

import { FaCalendarAlt } from 'react-icons/fa';

function MonthSummary() {
  const [revenue, setRevenue] = useState("");

  useEffect(() => {
    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/revenueWidget')
    .then(response => response.json())  
    .then(data => {
        setRevenue(data.revenue);
    }).catch(error => console.log(error));
  }, []);


  return (
    <div className='home-card halfheightcard'>
      <h1 className = 'widgettitle'><FaCalendarAlt className='icon'/>  ${revenue}</h1>
      
      <h4>
        Revenue of last 30 days
      </h4>
    </div>
  )
}

export default MonthSummary