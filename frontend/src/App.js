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

  const [user, setUser] = useState({name: "", email: ""});
  const [error, setError] = useState("");


  //login function
  const Login = details => {
    let userinfo = {
      "username" : details.email,
      "password" : details.password,
      "rememberMe": true
    }
    console.log(userinfo);
    
    fetch("http://127.0.0.1:5000/api/login", {
      method:"POST",
      mode: 'cors',
      headers:{
          "Content-Type":"application/json",
      },
      body: JSON.stringify(userinfo)
    }).then(response => {
      if ( response.ok ){
        console.log(user)
        //console.log("Logged in");
        setUser({
          email: details.email
        })
        console.log(user)
      } else {
        console.log("Details do not match.");
        setError("Details do not match");
      }
    });

  }

  let navigate = useNavigate();

  return (
    <div className="App">
      {(user.email != "") ? (
        <div className="welcome">
          {/* <Home user = {user} /> */}
          {navigate("/home", {state: {user: user}})}
          

        </div>
      ) : (
        <LoginForm Login={Login} error={error}/>
      )}
    </div>
  )
}



export default App;
