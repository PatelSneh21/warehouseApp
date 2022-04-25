import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";

const Customer = (props) => (
    <tr>
      <td>{props.customer["customer_name"]}</td>
    </tr>
  );

function ManageCustomers() {
    const [allCustomers, setAllCustomers] = useState({
        allCustomers: [{
            customer_id:"",
            customer_name:""
    }]});

    const [newCustomer, setNewCustomer] = useState({
        customer_name:"",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const {state} = useLocation();
    let userData = {
        "username" : state.username
    }
    const navigate = useNavigate();

    // display all customers on page load
    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allCustomers',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
          setAllCustomers({allCustomers: data.customers});
        })
        .catch(error => console.log(error));
    }, []);


    // update new customer state on form change
    const handleChange = (e) => {
        setSucess("")
        setError('')
        const item = e.target.name;
        const value = e.target.value;
        setNewCustomer(values => ({...values, [item]:value}))
    }

    // back button
    const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
    } 

    // get all the customers and put them into the table
    function customerList(collection) {
        return collection.allCustomers.map((current) => {
            return (
            <Customer
            key={current["customer_id"]}
            customer={current}
            />
            );
        });
    }

    // This function will handle the submission.
    // When submit button pressed add the new customer into the database
    // Then get the updated list and display it
    function onSubmit(e) {
        e.preventDefault();


        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addCustomer',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(newCustomer)
        })
        .then( async (response) => {
  
          // get json response here
          let data = await response.json();
          
          if(response.ok ){
            setNewCustomer({
                customer_name:"",
            });

            setAllCustomers({allCustomers: data.customers});
            setSucess("Customer successfully added");
          }else{
            setError("Error adding customer, please try again");
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
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchCustomer/' + searchTerm)
          .then(response => response.json())
          .then(data => setAllCustomers({allCustomers: data.customers}))
          .catch(error => console.log(error));
        } else {
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allCustomers',
            {
              method:"POST",
              mode: 'cors',
              headers:{
                  "Content-Type":"application/json",
              },
              body: JSON.stringify(userData)
            }).then(response => response.json())  
            .then(data => {
                setAllCustomers({allCustomers: data.customers});
            })
            .catch(error => console.log(error));
        }
      }, [searchTerm]);


  return (
    <div className="create-content">
    <div className="result-card">
    <h3>Create New Customer</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Customer Name: </label>
        <input
          type="text"
          className="form-control"
          name = "customer_name"
          value={newCustomer.customer_name}
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
        <h2>All Customers</h2>

        <div className="result-card">
            <h2>Customer Summary</h2>
            
                <h5>What are you looking for?</h5>
                <input className='search-bar' type="text" placeholder="Search by customer name" 
                onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
            
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="custtable-name">Customer Name</th>
                </tr>
            </thead>
            <tbody>{customerList(allCustomers)}</tbody>
            </Table>
        </div>
    </div>
  </div>
  )
}

export default ManageCustomers