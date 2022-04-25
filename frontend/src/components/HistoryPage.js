import React, {useState, useEffect} from 'react'
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import {useLocation} from "react-router-dom";


const Deposit = (props) => (
  <tr>
    <td>{props.item.item_name}</td>
    <td>{props.item.model_number}</td>
    <td>{props.item.deposit_date}</td>
    <td>{props.item.num_cartons}</td>
    <td>{props.item.bin_location}</td>
    <td>{props.item.rack_location}</td>
  </tr>
);

const Sale = (props) => (
  <tr>
    <td>{props.item.item_name}</td>
    <td>{props.item.model_number}</td>
    <td>{props.item.transaction_date}</td>
    <td>{props.item.num_cartons}</td>
    <td>{props.item.tax_collected}</td>
    <td>{props.item.revenue}</td>
    <td>{props.item.bin_location}</td>
    <td>{props.item.rack_location}</td>
    <td>{props.item.customer_name}</td>
  </tr>
);

const Sample = (props) => (
  <tr>
    <td>{props.item.item_name}</td>
    <td>{props.item.model_number}</td>
    <td>{props.item.withdraw_date}</td> 
    <td>{props.item.num_cartons}</td>
    <td>{props.item.bin_location}</td>
    <td>{props.item.rack_location}</td>
    <td>{props.item.user}</td>
  </tr>
);


function HistoryPage() {  

  const {state} = useLocation();

  let userData = {
    "username" : state.user.email
  }

  const [DepositItems, setDepositItems] = useState({
  items: [
    {deposit_id:1235, item_name:"5mm Fitting", model_number:"dgxv443", num_cartons:25, deposit_date:"2022-04-20", bin_info_bin_id:65, rack_info_rack_id:5}
]
});

const [salesItems, setSalesItems] = useState({
  items: [
    {transaction_id:1235, item_name:"5mm Fitting", model_number:"dgxv443", quantity:25, transaction_date:"2022-04-20", tax_collected:55, revenue:30, bin_info_bin_id:5, rack_info_rack_id:53, customer_name:"Justin"}    
  ]
  
});

const [sampleItems, setSampleItems] = useState({
  items: [{sample_id:1235, item_name:"5mm Fitting", model_number:"dgxv443", quantity:25, withdraw_date:"2022-04-20", bin_info_bin_id:75, rack_info_rack_id:5, user:"justinl"}
]
});

  useEffect(() => {
    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allDeposits',
    {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(userData)
    }).then(response => response.json())  
    .then(data => {
      setDepositItems({items: data.items});
    })
    .catch(error => console.log(error));

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allSamples',
    {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(userData)
    }).then(response => response.json())  
    .then(data => {
      setSampleItems({items: data.items});
    })
    .catch(error => console.log(error));

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allSales',
    {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(userData)
    }).then(response => response.json())  
    .then(data => {
      setSalesItems({items: data.items});
    })
    .catch(error => console.log(error));
    

}, []);

// This method will map out the recent sales onto the table
function depositList(collection) {
return collection.items.map((currentitem) => {
    return (
    <Deposit
    key={currentitem.deposit_id}
    item={currentitem}
    />
    );
});
}

function salesList(collection) {
  return collection.items.map((currentitem) => {
      return (
      <Sale
      key={currentitem.transaction_id}
      item={currentitem}
      />
      );
  });
  }

function sampleList(collection) {
  return collection.items.map((currentitem) => {
      return (
      <Sample
      key={currentitem.sample_id}
      item={currentitem}
      />
      );
  });
  }


return (
  <div className='inventory-wrapper'>
      <h2>Transaction History</h2>
      <div className='search-card'>
        <h5>What are you looking for?</h5>
        <Form>
          <Row>
            <Col xs={10}>
              <Form.Control placeholder="Search for an item, model num, etc" />
            </Col>
            <Col>
              
            </Col>
            <Col>
            <Button type="Submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="result-card">
          <h2>Deposits</h2>
          <Table striped borderless hover >
          <thead>
              <tr>
                <th className="histtable-item">Item</th>
                <th className="histtable-model">Model Number</th>
                <th className="histtable-date">Date</th>
                <th className="histtable-quantity">Quantity (cartons)</th>
                <th className="histtable-bin">Bin Number</th>
                <th className="histtable-rack">Rack Number</th>
              </tr>
          </thead>
          <tbody>{depositList(DepositItems)}</tbody>
          </Table>
      </div>

      <div className="result-card">
          <h2>Sales</h2>
          <Table striped borderless hover >
          <thead>
              <tr>
                <th className="histtable-item">Item</th>
                <th className="histtable-model">Model Number</th>
                <th className="histtable-date">Date</th>
                <th className="histtable-quantity">Quantity (cartons)</th>
                <th className="histtable-tax">Tax Collected</th>
                <th className="histtable-revenue">Revenue</th>
                <th className="histtable-bin">Bin Number</th>
                <th className="histtable-rack">Rack Number</th>
                <th className="histtable-customer">Customer</th>
              </tr>
          </thead>
          <tbody>{salesList(salesItems)}</tbody>
          </Table>
      </div>

      <div className="result-card">
          <h2>Free Samples</h2>
          <Table striped borderless hover >
          <thead>
              <tr>
              <th className="histtable-item">Item</th>
                <th className="histtable-model">Model Number</th>
                <th className="histtable-date">Date</th>
                <th className="histtable-quantity">Quantity (cartons)</th>
                <th className="histtable-bin">Bin Location</th>
                <th className="histtable-rack">Rack Location</th>
                <th className="histtable-customer">User</th>
              </tr>
          </thead>
          <tbody>{sampleList(sampleItems)}</tbody>
          </Table>
      </div>
  </div>
)
}

export default HistoryPage