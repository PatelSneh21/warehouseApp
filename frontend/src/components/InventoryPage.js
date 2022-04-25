import React, {useState, useEffect} from 'react'
import {useLocation} from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";


// function handleDelete(props) {
//   console.log("delete clicked" + props.item["Item ID"]);
// }

// TODO CONVERT NUM-CARTONS QUANTITY TO ITEM QUANTITY
// RIGHT NOW DATABASE ONLY STORES NUM QUANTITY



function InventoryPage() {

  function handleEdit(props) {
    console.log("delete clicked" + props.item["Item ID"]);
  }
  
  const Item = (props) => (
    <tr>
      <td>{props.item["Item Name"]}</td>
      <td>{props.item["Item Model Num"]}</td>
      <td>{props.item["Item Price"]}</td>
      <td>{props.item["Item Quantity"]}</td>
      <td>{props.item["Minimum Quantity"]}</td>
      {/* <td>{props.item.info}</td> */}
      <td>
        <Button variant="primary"
        onClick={() => handleBins(props)}
        >Bins</Button>
      </td>
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

    
  const FoundLocation = (props) => (
    <tr>
      <td>{props.bin["bin_location"]}</td>
      <td>{props.bin["rack_location"]}</td>
      <td>{props.bin["num_cartons"]}</td>
    </tr>
  );


  const [invItems, setInvItems] = useState({
    items: [{item_name:"5mm Fitting", model_number:"dgxv443", quantity:"450", minQuantity: "1"}, 
    {item_name:"12mm Fitting", model_number:"asdfa66", quantity:"378", minQuantity: "1"}]
  });

  const [findBins, setFindBins] = useState({
    bins: [{bin_location: "", rack_location:"", num_cartons:""}]
  });

  const [currentItem, setCurrentItem] = useState("");


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
      fetch('http://127.0.0.1:5000/api/allItems',
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

    // This method will map out the recent sales onto the table
    function foundList(collection) {
      //console.log(collection)
      return collection.bins.map((current) => {
          return (
          <FoundLocation
          key={current["bin_location"]}
          bin={current}
          />
          );
      });
    }

  function handleBins(props) {
    // console.log("Locate bins for " + props.item["Item Name"]);

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/searchBin/' + props.item['Item ID'])
      .then(response => response.json())  
      .then(data => {
        setFindBins({bins: data.bins});
        setCurrentItem(props.item["Item Name"]);
        //console.log(data.items)
        })
        .catch(error => console.log(error));
  
    // fetch locateBins
    // input only item id
    // search deposit and withdraw and samples
    // if Deposit.item_id == item_id
    //    then item[bin_id] += numcartons
    // if withdraw and sales itemid == item id
    //   then item[bin_id] -= numcartons
    // for each bin_id
    // bin_id: numcartons
    // search bin_id to get bin_location
    // bin_location: num cartons
  }


  return (
    <div className='inventory-wrapper'>
        <h2>Inventory</h2>
        <div className='search-card'>
          <h5>What are you looking for?</h5>
          <input className='search-bar' type="text" placeholder="Search for an item, model num, etc" 
          onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
        </div>

          {currentItem !== "" && 
              <div className='result-card'>
                <h5>Located bins for {currentItem}</h5>
                <Table striped borderless hover >
                  <thead>
                      <tr>
                      <th className="foundbintable-bin">Bin Number</th>
                      <th className="foundbintable-rack">Rack Number</th>
                      <th className="foundbintable-cartons">Cartons Available</th>
                      </tr>
                  </thead>
                  <tbody>{foundList(findBins)}</tbody>
                  </Table>
              </div>
          }

        <div className="result-card">
            <h2>Item Summary</h2>



            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="invtable-item">Item</th>
                  <th className="invtable-model">Model Number</th>
                  <th className="invtable-model">Price (per item)</th>
                  <th className="invtable-quantity">Quantity (items)</th>
                  <th className="invtable-minquantity">Minimum Quantity (items)</th>
                  {/* <th className="invtable-info">Additional Information</th> */}
                  <th className="invtable-info">Locate Bins</th>
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