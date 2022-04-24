import React, {useState, useEffect} from 'react'
import {useLocation} from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";


// function handleDelete(props) {
//   console.log("delete clicked" + props.item["Item ID"]);
// }

// TODO CONVERT NUM-CARTONS QUANTITY TO ITEM QUANTITY
// RIGHT NOW DATABASE ONLY STORES NUM QUANTITY

function handleEdit(props) {
  console.log("delete clicked" + props.item["Item ID"]);
}

const Item = (props) => (
  <tr>
    <td>{props.item["Item Name"]}</td>
    <td>{props.item["Item Model Num"]}</td>
    <td>{props.item["Item Price"]}</td>
    <td>{props.item["Item Quantity"]}</td>
    {/* <td>{props.item.info}</td> */}
    <td>
      <Button variant="primary"
      onClick={() => handleEdit(props)}
      >edit</Button>
    </td>
    {/* <td>
      <Button variant="primary"
      onClick={() => handleDelete(props)}>delete</Button>
    </td> */}
  </tr>
);

function InventoryPage() {
  const [invItems, setInvItems] = useState({
    items: [{item_name:"5mm Fitting", model_number:"dgxv443", quantity:"450", info: ""}, 
    {item_name:"12mm Fitting", model_number:"asdfa66", quantity:"378", info: ""},
    {item_name:"2m Tube", model_number:"45agb", quantity:"3200", info: ""},
    {item_name:"12pc Socket Wrench Set", model_number:"fgg9f", quantity:"100", info: ""},
    {item_name:"Drain Cleaner", model_number:"dfaa4", quantity:"100", info: ""},
    {item_name:"Wash Basin", model_number:"4df6", quantity:"100", info: ""},
    {item_name:"Insert Style Shower Drain", model_number:"dsbt655", quantity:"100", info: ""},
    {item_name:"Small Water Pump", model_number:"dsavcnb7", quantity:"300", info: ""},
    {item_name:"Fine Particle Filter", model_number:"435hhn", quantity:"800", info: ""}]
  });

  const {state} = useLocation();

  let userData = {
    "username" : state.user.email
  }

  /*
    search functionality
  */
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== "") {
      //'http://127.0.0.1:5000/api/searchItemModel/' + searchTerm
      //'http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchItemModel/' + searchTerm
      fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchItemModel/' + searchTerm)
      .then(response => response.json())
      .then(data => setInvItems({items: data.items}))
      .catch(error => console.log(error));
    } else {
      fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allItems',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
          setInvItems({items: data.items});
        })
        .catch(error => console.log(error));
    }
  }, [searchTerm]);


    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allItems',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
          setInvItems({items: data.items});
          //console.log(data.items)
        })
        .catch(error => console.log(error));
        
   
    }, []);

  // This method will map out the recent sales onto the table
  function itemList(collection) {
    //console.log(collection)
    return collection.items.map((currentitem) => {
        return (
        <Item
        key={currentitem["Item Model Num"]}
        item={currentitem}
        />
        );
    });
  }


  return (
    <div className='inventory-wrapper'>
        <h2>Inventory</h2>
        <div className='search-card'>
          <h5>What are you looking for?</h5>
          <input className='search-bar' type="text" placeholder="Search for an item, model num, etc" 
          onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
        </div>

        <div className="result-card">
            <h2>Item Summary</h2>
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="invtable-item">Item</th>
                  <th className="invtable-model">Model Number</th>
                  <th className="invtable-model">Price (per item)</th>
                  <th className="invtable-quantity">Quantity (items)</th>
                  {/* <th className="invtable-info">Additional Information</th> */}
                  <th className="invtable-info">Actions</th>
                </tr>
            </thead>
            <tbody>{itemList(invItems)}</tbody>
            </Table>
        </div>
    </div>
  )
}

export default InventoryPage