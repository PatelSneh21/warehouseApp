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
  const adminUser = {
    email: "admin@admin.com",
    password: "34rferfwvgg"
  }

  const [user, setUser] = useState({name: "", email: ""});
  const [error, setError] = useState("");

  function Authenticate(userInfo) {
    // fetch("/api/login", {
    //   method:"POST",
    //   cache: "no-cache",
    //   headers:{
    //       "content_type":"application/json",
    //   },
    //   body:JSON.stringify(userInfo)
    // }).then(response => {
    //   return response.status === 200
    // })
    console.log(JSON.stringify(userInfo));
    return true;
  }


  //login function
  const Login = details => {
    console.log(details);
    


    if (Authenticate(details)){
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
