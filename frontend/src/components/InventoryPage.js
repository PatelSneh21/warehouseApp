import React, {useState, useEffect} from 'react'
import { Col, Row, Form, Table, Button } from "react-bootstrap";


const Item = (props) => (
  <tr>
    <td>{props.item["Item Name"]}</td>
    <td>{props.item["Item Model Num"]}</td>
    <td>{props.item["Item Quantity"]}</td>
    <td>{props.item.info}</td>
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

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/allItems',
        )
        .then((response) =>{
          console.log(response.data);
            setInvItems({items: response.data});
        }).catch(error => console.log(error));
    }, []);

// This method will map out the recent sales onto the table
function itemList(collection) {
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
            <h2>Item Summary</h2>
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="invtable-item">Item</th>
                  <th className="invtable-model">Model Number</th>
                  <th className="invtable-quantity">Quantity</th>
                  <th className="invtable-info">Additional Information</th>
                </tr>
            </thead>
            <tbody>{itemList(invItems)}</tbody>
            </Table>
        </div>
    </div>
  )
}

export default InventoryPage