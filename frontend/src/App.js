import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

function App() {
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const [user, setUser] = useState({name: "", email: ""});
  const [error, setError] = useState("");

  //login function
  const Login = details => {
    console.log(details);

    if (details.email == adminUser.email && details.password == adminUser.password){
      console.log("Logged in");
      setUser({
        email: details.email
      })
    } else {
      console.log("Details do not match.");
      setError("Details do not match");
    }
  }

  const Logout = () => {
    console.log("Logout");
  }

  return (
    <div className="App">
      {(user.email != "") ? (
        <div className="welcome">
          <h2> Welcome, <span>{user.email}</span></h2>
          <button>Logout</button>
        </div>
      ) : (
        <LoginForm Login={Login} error={error}/>
      )}
    </div>
  )
}



export default App;
