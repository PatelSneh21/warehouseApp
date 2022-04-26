import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";

const User = (props) => (
    <tr>
        <td>{props.user["user_username"]}</td>
        <td>{props.user["user_name"]}</td>
        <td>{props.user["user_type"]}</td>
    </tr>
  );

function ManageUsers() {
    // state for displaying all users
    const [allUsers, setAllUsers] = useState({
        allUsers: [{
            user_id:"",
            user_username:"",
            user_name: "",
            user_type: "",
    }]});

    // state for adding a new user
    const [newUser, setNewUser] = useState({
        user_username:"",
        user_name: "",
        user_type: "Employee",
        user_password:""
    });


    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const {state} = useLocation();
    let userData = {
        "username" : state.username
    }
    const navigate = useNavigate();


    // display all users on page load
    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allUsers',
        {
            method:"POST",
            mode: 'cors',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
            setAllUsers({allUsers: data.users});
        })
        .catch(error => console.log(error));
    }, []);

    // update new user state on form change
    const handleChange = (e) => {
        setSucess("")
        setError('')
        const item = e.target.name;
        const value = e.target.value;
        setNewUser(values => ({...values, [item]:value}))
    }

    function onChangeType(e) {
        setSucess("")
        setError("")
        const newFormType = e.target.value;
        setNewUser(values => ({...values, ['user_type']:newFormType}))
        console.log(newUser)
    }

    // back button
    const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
    }

    // get all the users and put them into the table
    function userList(collection) {
    return collection.allUsers.map((current) => {
        return (
        <User
        key={current["user_id"]}
        user={current}
        />
        );
    });
    }


    // This function will handle the submission.
    // When submit button pressed add the new user into the database
    // Then get the updated user list and display it
    function onSubmit(e) {
      console.log(newUser)
        e.preventDefault();

        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/signup',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(newUser)
        })
        .then( async (response) => {
  
          // get json response here
          let data = await response.json();
          
          if( response.ok ){
            setSucess("User successfully added");
            setNewUser({
                user_username:"",
                user_name: "",
                user_type: "Employee",
                user_password:""
            });

            setAllUsers({allUsers: data.users});
          }else{
            setError("Error adding user, please try again");
          }
        })
        .catch((err) => {
            console.log(err);
        })
    }


  return (
    <div className="create-content">
    <div className="result-card">
    <h3>Create New User Account</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label> Username: </label>
        <input
          type="text"
          className="form-control"
          name = "user_username"
          value={newUser.user_username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>First and Last Name: </label>
        <input
          type="text"
          className="form-control"
          name = "user_name"
          value={newUser.user_name}
          onChange={handleChange}
          required
        />
      </div>
    <div className="form-group">
        <label for="radios">User Type</label>
        <div class="col-md-8" onChange={onChangeType}> 
        <label class="radio-inline" for="radios-0">
        <input type="radio" name="radios" class='radio-input' id="radios-0" value="Employee" defaultChecked/>
        Employee
        </label> 
        <label class="radio-inline" for="radios-1">
        <input type="radio" name="radios" id="radios-1" value="Admin"/>
        Admin
        </label>
    </div>
    </div>
      <div className="form-group">
        <label>Password: </label>
        <input
          type="text"
          className="form-control"
          name = "user_password"
          value={newUser.user_password}
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
        <h2>All Users</h2>

        <div className="result-card">
            <h2>User Summary</h2>
            
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="usertable-username">Username</th>
                  <th className="usertable-name">Full Name</th>
                  <th className="usertable-usertype">User Type</th>
                </tr>
            </thead>
            <tbody>{userList(allUsers)}</tbody>
            </Table>
        </div>
    </div>
  </div>
  )
}

export default ManageUsers