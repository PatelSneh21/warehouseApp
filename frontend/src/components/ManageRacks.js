import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";

const Rack = (props) => (
    <tr>
      <td>{props.rack["rack_location"]}</td>
    </tr>
  );

function ManageRacks() {

    const [allRacks, setAllRacks] = useState({
        allRacks: [{
            rack_id:"",
            rack_location:""
    }]});

    const [newRack, setNewRack] = useState({
        rack_location:"",
    });

    
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const {state} = useLocation();
    let userData = {
      "username" : state.username
    }
    const navigate = useNavigate();

    // display all racks on page load
    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allRacks',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
          setAllRacks({allRacks: data.racks});
        })
        .catch(error => console.log(error));
    }, []);

    // update new rack state on form change
    const handleChange = (e) => {
        setSucess("")
        setError('')
        const item = e.target.name;
        const value = e.target.value;
        setNewRack(values => ({...values, [item]:value}))
    }

    // back button
    const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
    } 


    // get all the racks and put them into the table
    function rackList(collection) {
        return collection.allRacks.map((current) => {
            return (
            <Rack
            key={current["rack_id"]}
            rack={current}
            />
            );
        });
    }


    // This function will handle the submission.
    // When submit button pressed add the new rack into the database
    // Then get the updated rack list and display it
    function onSubmit(e) {
        e.preventDefault();


        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addRack',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(newRack)
        })
        .then( async (response) => {
  
          // get json response here
          let data = await response.json();
          
          if(response.ok ){
            setNewRack({
                rack_location:"",
            });

            setAllRacks({allRacks: data.racks});
            
            setSucess("Rack successfully added");
          }else{
            setError("Error adding rack, please try again");
          }
  
        })
        .catch((err) => {
            console.log(err);
        })
    }


    // search feature to change result table if search term in any of the attributes
    // runs every time the search term changes, no submit button required
    useEffect(() => {
        if (searchTerm !== "") {
          //'http://127.0.0.1:5000/api/searchItemModel/' + searchTerm
          //'http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchItemModel/' + searchTerm
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchRack/' + searchTerm)
          .then(response => response.json())
          .then(data => setAllRacks({allRacks: data.racks}))
          .catch(error => console.log(error));
        } else {
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allRacks',
            {
              method:"POST",
              mode: 'cors',
              headers:{
                  "Content-Type":"application/json",
              },
              body: JSON.stringify(userData)
            }).then(response => response.json())  
            .then(data => {
                setAllRacks({allRacks: data.racks});
            })
            .catch(error => console.log(error));
        }
      }, [searchTerm]);


  return (
    <div className="create-content">
    <div className="result-card">
    <h3>Create New Rack</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Rack Number: </label>
        <input
          type="text"
          className="form-control"
          name = "rack_location"
          value={newRack.rack_location}
          onChange={handleChange}
          required
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

  <div className='inventory-wrapper'>
        <h2>All Racks</h2>

        <div className="result-card">
            <h2>Rack Summary</h2>
            
                <h5>What are you looking for?</h5>
                <input className='search-bar' type="text" placeholder="Search by rack number" 
                onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
            
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="racktable-rack">Rack Number</th>
                </tr>
            </thead>
            <tbody>{rackList(allRacks)}</tbody>
            </Table>
        </div>
    </div>
  </div>
  )
}

export default ManageRacks