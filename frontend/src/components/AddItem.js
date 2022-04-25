import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";

function AddItem() {

    const [invItem, setInvItem] = useState({
        item_name: "",
        model_number: "",
        item_price: "",
        quantity: 0,
        minQuantity: ""
      });

      // state for adding a new carton
    const [newCarton, setNewCarton] = useState({
      carton_size: "",
      num_items: "",
      model_number:""
    });

    const [error, setError] = useState("");
    const [success, setSucess] = useState("");

    const [cartonError, setCartonError] = useState("");
    const [cartonSuccess, setCartonSuccess] = useState("");

      // These methods will update the state properties.
      const handleChange = (e) => {
        setSucess("")
        setError('')
        const item = e.target.name;
        const value = e.target.value;
        setInvItem(values => ({...values, [item]:value}))
        //console.log(invItem)
      }

      const navigate = useNavigate();
      const {state} = useLocation();
      const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
      }

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
                    quantity: 0,
                    minQuantity: ""
                });
                setSucess("Item successfully added");
            } else {
              setError("Error adding item, please try again");
            }
        });
    }


    // update new carton state on form change
    const handleCartonChange = (e) => {
      setCartonSuccess("")
      setCartonError('')
      const item = e.target.name;
      const value = e.target.value;
      setNewCarton(values => ({...values, [item]:value}))
      }

    // This function will handle the submission.
    // When submit button pressed add the new carton into the database
    // Then get the updated carton list and display it
    function onSubmitCarton(e) {
      e.preventDefault();

      fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addCarton',
      {
        method:"POST",
        mode: 'cors',
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(newCarton)
      })
      .then( async (response) => {

        // // get json response here
        // let data = await response.json();
        
        if(response.ok ){
          // setNewCarton({
          //     carton_size: "",
          //     num_items: "",
          //     model_number:""
          // });

          // setAllCartons({allCartons: data.cartons});
          setSucess("Master carton successfully added");
        }else{
          setError("Error adding master carton, please try again");
        }
      })
      .catch((err) => {
          console.log(err);
      })
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
              <label>Model number: </label>
              <input
                type="text"
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
            <div className="form-group">
              <label>Minimum quantity before reorder alert: </label>
              <input
                type="number"
                className="form-control"
                name = "minQuantity"
                value={invItem.minQuantity}
                onChange={handleChange}
              />
            </div>
            {(success != "") ? ( <div className="successMsg">{success}</div>) : ""}
            {(error != "") ? ( <div className="error">{error}</div>) : ""}
            <div className="form-group">
            <button id="Submit" name="Submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
          <button 
                class="btn btn-primary" size=""
                onClick={() => handleBack()}
              >
               Back
          </button>
        </div>

        <div className="result-card">
        <h3>Create New Carton</h3>
        <h5>Items should be in corresponding master cartons</h5>
        <form onSubmit={onSubmitCarton}>
          <div className="form-group">
            <label>Carton Size: </label>
            <input
              type="text"
              className="form-control"
              name = "carton_size"
              value={newCarton.carton_size}
              onChange={handleCartonChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Items per carton: </label>
            <input
              type="number"
              className="form-control"
              name = "num_items"
              value={newCarton.num_items}
              onChange={handleCartonChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Model Number: </label>
            <input
              type="text"
              className="form-control"
              name = "model_number"
              value={newCarton.model_number}
              onChange={handleCartonChange}
              required
            />
          </div>

          {(success != "") ? ( <div className="successMsg">{cartonSuccess}</div>) : ""}
          {(error != "") ? ( <div className="error">{cartonError}</div>) : ""}
          <div className="form-group">
          <button id="Submit" name="Submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
        <button 
              class="btn btn-primary" size=""
              onClick={() => handleBack()}
            >
            Back
        </button>
  </div>
        </div>
        
      )
}

export default AddItem;

