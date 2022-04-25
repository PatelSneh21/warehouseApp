import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
  Switch,
} from "react-router-dom";
import "./App.css"

function App() {

  const [user, setUser] = useState({username: "", isAdmin: false});
  const [error, setError] = useState("");

  //login function
  const Login = details => {
    let userinfo = {
      "username" : details.email,
      "password" : details.password,
      "rememberMe": true
    }

    fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/login',
    {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(userinfo)
    })
    .then( async (response) => {

      // get json response here
      let data = await response.json();
      
      if(response.ok ){

        setUser({
          username: details.email,
          isAdmin: data["isAdmin"]
        })
      }else{
        setError("Details do not match");
      }
    })
    .catch((err) => {
        console.log(err);
    })
  }

  let navigate = useNavigate();

  return (
    <div className="App">
      {(user.username != "") ? (
        <div className="welcome">
          {navigate("/home", {state: user})}
        </div>
      ) : (
        <LoginForm Login={Login} error={error}/>
      )}
    </div>
  )
}



export default App;
