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
    setIsEditing(true);
    setEditItem({
      item_id: props.item["Item ID"],
      item_name: props.item["Item Name"],
      model_number: props.item["Item Model Num"],
      item_price: props.item["Item Price"],
      quantity: props.item["Item Quantity"],
      minQuantity: props.item["Minimum Quantity"],
    })
    //console.log("delete clicked" + props.item["Item ID"]);
  }

  function handleCloseEdit() {
    setIsEditing(false);
    setSucess("")
    setError("")
    setEditItem({item_id:"",item_name:"", model_number:"", item_price:'', quantity:"", minQuantity: ""});
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
      {state.isAdmin && 
      <td>
      <Button variant="primary"
      onClick={() => handleEdit(props)}
      >Edit</Button>
      </td>}
      
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

  const [editItem, setEditItem] = useState(
    {item_id:"",item_name:"", model_number:"", item_price:'', quantity:"", minQuantity: ""});

  const [findBins, setFindBins] = useState({
    bins: [{bin_location: "", rack_location:"", num_cartons:""}]
  });

  const [currentItem, setCurrentItem] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const [newEdit, setNewEdit] = useState(false);

  const {state} = useLocation();

  let userData = {
    "username" : state.username
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
  }, [newEdit]);

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

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchBin/' + props.item['Item ID'])
      .then(response => response.json())  
      .then(data => {
        setFindBins({bins: data.bins});
        setCurrentItem(props.item["Item Name"]);
        //console.log(data.items)
        })
        .catch(error => console.log(error));
  }

  // These methods will update the state properties on edit card.
  const handleChange = (e) => {
    // setSucess("")
    // setError('')
    const item = e.target.name;
    const value = e.target.value;
    setEditItem(values => ({...values, [item]:value}))
    //console.log(editItem)
  }

  // This function will handle the submission.
  function onSubmit(e) {
    e.preventDefault();

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/editItemInfo',
    {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(editItem)
    }).then(response => {
        if ( response.ok ){
            // setEditItem({
            //   item_id:"",
            //   item_name: "",
            //   model_number: "",
            //   item_price:"",
            //   quantity: "",
            //   minQuantity: ""
            // });
            setSucess("Item successfully edited");
            setNewEdit(!newEdit)
        } else {
          setError("Error editing item, please try again");
        }
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

        {isEditing && 
        <div className="result-card">
          <h3>Edit</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Item name: </label>
              <input
                type="text"
                className="form-control"
                name = "item_name"
                value={editItem.item_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Model number: </label>
              <input
                type="text"
                className="form-control"
                name = "model_number"
                value={editItem.model_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Item price: </label>
              <input
                type="number"
                className="form-control"
                name = "item_price"
                value={editItem.item_price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Item quantity: </label>
              <input
                type="number"
                className="form-control"
                name = "quantity"
                value={editItem.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Minimum quantity before reorder alert: </label>
              <input
                type="number"
                className="form-control"
                name = "minQuantity"
                value={editItem.minQuantity}
                onChange={handleChange}
              />
            </div>
            {(success != "") ? ( <div className="successMsg">{success}</div>) : ""}
            {(error != "") ? ( <div className="error">{error}</div>) : ""}
            <div className="form-group">
            <button id="Submit" name="Submit" class="btn btn-primary">Submit</button>
            </div>
            <Button variant="primary"
            onClick={() => handleCloseEdit()}
            >Close</Button>
          </form>
        </div>
        }

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
                  {state.isAdmin && <th className="invtable-info">Actions</th>}
                  
                </tr>
            </thead>
            <tbody>{itemList(invItems)}</tbody>
            </Table>
        </div>
    </div>
  )
}

export default InventoryPage