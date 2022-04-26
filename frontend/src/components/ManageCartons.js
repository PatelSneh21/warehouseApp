import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";


function ManageCartons() {

  const Carton = (props) => (
    <tr>
        <td>{props.carton["model_number"]}</td>
        <td>{props.carton["item_name"]}</td>
        <td>{props.carton["carton_size"]}</td>
        <td>{props.carton["num_items"]}</td>
        {state.isAdmin && 
        <td>
        <Button variant="primary"
        onClick={() => handleEdit(props)}
        >Edit</Button>
        </td>}
    </tr>
  );

    // state for displaying all cartons
    const [allCartons, setAllCartons] = useState({
        allCartons: [{
            carton_id:"",
            carton_size: "",
            num_items: "",
            model_number:"",
            item_name:""
    }]});

    // state for adding a new carton
    const [newCarton, setNewCarton] = useState({
        carton_size: "",
        num_items: "",
        model_number:""
    });

    const [editItem, setEditItem] = useState(
      {});
    const [isEditing, setIsEditing] = useState(false);
    const [newEdit, setNewEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const {state} = useLocation();
    let userData = {
        "username" : state.username
    }
    const navigate = useNavigate();

    // display all cartons on page load
    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allCartons',
        {
            method:"POST",
            mode: 'cors',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
            setAllCartons({allCartons: data.cartons});
        })
        .catch(error => console.log(error));
    }, []);

    // display all cartons on page load
    useEffect(() => {
      fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allCartons',
      {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
      }).then(response => response.json())  
      .then(data => {
          setAllCartons({allCartons: data.cartons});
      })
      .catch(error => console.log(error));
  }, [newEdit]);
  

    // update new carton state on form change
    const handleChange = (e) => {
    setSucess("")
    setError('')
    const item = e.target.name;
    const value = e.target.value;
    if (isEditing) {
      setEditItem(values => ({...values, [item]:value}))
    } else {
      setNewCarton(values => ({...values, [item]:value}))
    }
      console.log(editItem)
    }

    // back button
    const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
    }

    function handleEdit(props) {
      setIsEditing(true);
      setSucess("")
      setError("")
      setEditItem({
        carton_id: props.carton["carton_id"],
        carton_size: props.carton["carton_size"],
        num_items: props.carton["num_items"],
        model_number:props.carton["model_number"],
        item_name:props.carton["item_name"]
      })
      //console.log("delete clicked" + props.item["Item ID"]);
    }

    function handleCloseEdit() {
      setIsEditing(false);
      setSucess("")
      setError("")
      setNewCarton({carton_size: "", num_items: "",model_number:""});
      setEditItem({item_id:"",item_name:"", model_number:"", item_price:'', quantity:"", minQuantity: ""});
    }

    // get all the cartons and put them into the table
    function cartonList(collection) {
    return collection.allCartons.map((current) => {
        return (
        <Carton
        key={current["carton_id"]}
        carton={current}
        />
        );
    });
    }

    // This function will handle the submission.
    // When submit button pressed add the new carton into the database
    // Then get the updated carton list and display it
    function onSubmit(e) {
        e.preventDefault();

        if (isEditing) {
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/editCarton',
          {
            method:"POST",
            mode: 'cors',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(editItem)
              }).then(response => {
          if ( response.ok ){
              setSucess("Item successfully edited");
              setNewEdit(!newEdit)
          } else {
            setError("Error editing item, please try again");
          }
          });
        } else {
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
  
          // get json response here
          let data = await response.json();
          
          if(response.ok ){
            setSucess("Master carton successfully added");
            setNewCarton({
                carton_size: "",
                num_items: "",
                model_number:""
            });

            setAllCartons({allCartons: data.cartons});
          }else{
            setError("Error adding master carton, please try again");
          }
        })
        .catch((err) => {
          setError("Error adding master carton, please try again");
          console.log(err);
        })
        }
    }

    // search feature to change result table if search term in any of the attributes
    // runs every time the search term changes, no submit button required
    useEffect(() => {
        if (searchTerm !== "") {
          //'http://127.0.0.1:5000/api/searchItemModel/' + searchTerm
          //'http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchItemModel/' + searchTerm
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchCarton/' + searchTerm)
          .then(response => response.json())
          .then(data => setAllCartons({allCartons: data.cartons}))
          .catch(error => console.log(error));
        } else {
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allCartons',
            {
              method:"POST",
              mode: 'cors',
              headers:{
                  "Content-Type":"application/json",
              },
              body: JSON.stringify(userData)
            }).then(response => response.json())  
            .then(data => {
                setAllCartons({allCartons: data.cartons});
            })
            .catch(error => console.log(error));
        }
      }, [searchTerm]);    

  return (
    <div className="create-content">
    <div className="result-card">
    {isEditing?  <h3>Edit Carton {editItem.carton_id}</h3> :  <h3>Create New Carton</h3>}
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Carton Size: </label>
        <input
          type="text"
          className="form-control"
          name = "carton_size"
          value={isEditing? editItem.carton_size : newCarton.carton_size}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Items per carton: </label>
        <input
          type="number"
          className="form-control"
          name = "num_items"
          value={isEditing? editItem.num_items : newCarton.num_items}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Model Number: </label>
        <input
          type="text"
          className="form-control"
          name = "model_number"
          value={isEditing? editItem.model_number : newCarton.model_number}
          onChange={handleChange}
          readOnly={isEditing}
          required
        />
      </div>

      {(success != "") ? ( <div className="successMsg">{success}</div>) : ""}
      {(error != "") ? ( <div className="error">{error}</div>) : ""}
      <div className="form-group">
      <button id="Submit" name="Submit" class="btn btn-primary">Submit</button>
      </div>
      {isEditing &&  <Button variant="primary"
                  onClick={() => handleCloseEdit()}
                  >Cancel Editing</Button> }
    </form>
    <button 
          class="btn btn-primary" size=""
          onClick={() => handleBack()}
        >
         Back
    </button>
    
    
  </div>

  <div className='inventory-wrapper'>
        <h2>All Cartons</h2>

        <div className="result-card">
            <h2>Carton Summary</h2>
            
                <h5>What are you looking for?</h5>
                <input className='search-bar' type="text" placeholder="Search by rack number" 
                onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
            
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="cartontable-modelnum">Model Number</th>
                  <th className="cartontable-modelname">Model Name</th>
                  <th className="cartontable-size">Carton Size</th>
                  <th className="cartontable-items">Items per carton</th>
                </tr>
            </thead>
            <tbody>{cartonList(allCartons)}</tbody>
            </Table>
        </div>
    </div>
  </div>
  )
}

export default ManageCartons