import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

function AddItem() {

    const [invItem, setInvItem] = useState({
        item_name: "",
        model_number: "",
        item_price: "",
        quantity: "",
      });

    const [error, setError] = useState("");
    const [success, setSucess] = useState("");

      // These methods will update the state properties.
      const handleChange = (e) => {
        setSucess("")
        const item = e.target.name;
        const value = e.target.value;
        setInvItem(values => ({...values, [item]:value}))
        console.log(invItem)
      }

    // function onChangeItemName(e) {
    //     setInvItem({
    //     item_name: e.target.value,
        
    //     });
    //     console.log(invItem);
    // }

    // function onChangeModelNumber(e) {
    //     setInvItem({
    //         model_number: e.target.value,
    //     });
    //     console.log(invItem);
    // }

    // function onChangeItemPrice(e) {
    //     setInvItem({
    //         item_price: e.target.value,
    //     });
    //     console.log(invItem);
    // }

    // function onChangeItemQuantity(e) {
    //     setInvItem({
    //         quantity: e.target.value,
    //     });
    // }

// This function will handle the submission.
    function onSubmit(e) {
        e.preventDefault();

        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addItem',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(invItem)
        }).then(response => {
            if ( response.ok ){
                setInvItem({
                    item_name: "",
                    model_number: "",
                    item_price:"",
                    quantity: "",
                });
                setSucess("Item successfully added");
            } else {
              setError("Error adding item, please try again");
            }
        });
    }

    return (
        <div className="create-content">
          <div className="result-card">
          <h3>Create New Item</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Item name: </label>
              <input
                type="text"
                className="form-control"
                name = "item_name"
                value={invItem.item_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Model Number: </label>
              <input
                type="number"
                className="form-control"
                name = "model_number"
                value={invItem.model_number}
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
                value={invItem.item_price}
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
                value={invItem.quantity}
                onChange={handleChange}
              />
            </div>
            {(success != "") ? ( <div className="successMsg">{success}</div>) : ""}
            {(error != "") ? ( <div className="error">{error}</div>) : ""}
            <div className="form-group">
              <input
                type="submit"
                value="Create record"
                className="btn"
              />
            </div>
          </form>
          <NavLink className="create-backbtn btn" role="button" aria-pressed="false" exact to="/home">
            Back
          </NavLink>
        </div>
        </div>
        
      )
}

export default AddItem;

