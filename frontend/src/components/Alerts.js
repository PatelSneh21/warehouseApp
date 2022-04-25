import React, {useState, useEffect} from 'react'
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import {useLocation} from "react-router-dom";

const Alert = (props) => (
  <tr>
    <td>{props.item.item_name}</td>
    <td>{props.item.model_number}</td>
    <td>{props.item.quantity}</td>
  </tr>
);

function Alerts() {

  const [alertItems, setAlertItems] = useState({
    items: [
      {item_id:"", item_name:"", model_number:"", quantity:0}]
  });

  const [hasAlerts, setHasAlerts] = useState(false);

  useEffect(() => {
    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/getAllBelowMinQuantity')
    .then(response => response.json())  
    .then(data => {
      setAlertItems({items: data.items});
      setHasAlerts(true)
    })
    .catch(error => console.log(error));
  }, []);


  // This method will map out the alerts onto the table
  function alertList(collection) {
  return collection.items.map((currentitem) => {
      return (
      <Alert
      key={currentitem.item_id}
      item={currentitem}
      />
      );
  });
  }


  return (
    <div className='home-card widgetcard'>
      <h2>Alerts</h2>
      {hasAlerts && 
      <p>Low Inventory</p>
      }
      <Table striped borderless hover >
      <thead>
          <tr>
            <th className="hometable-alert">Item Name</th>
            <th className="hometable-model">Model Number</th>
            <th className="hometable-cartons">Cartons Remaining</th>
          </tr>
      </thead>
      <tbody>{alertList(alertItems)}</tbody>
      </Table>
    </div>
  )
}

export default Alerts