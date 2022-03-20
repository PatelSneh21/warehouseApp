import React, { useState } from 'react';

import Logo from '../assets/bvlogo.png';


function LoginForm({ Login, error }) {
    const [details, setDetails] = useState({email: "", password:""});

    const submitHandler = event => {
        event.preventDefault();

        Login(details);
    }
  return (
    <form onSubmit = {submitHandler}>
        <div className="inner">
            <img src={Logo} />
           
            {(error != "") ? ( <div className="error"></div>) : ""}
            
            <div className="group">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" onChange={event => setDetails({...details, email: event.target.value})} value={details.email}/>
            </div>
            <div className="group">
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" onChange={event => setDetails({...details, password: event.target.value})} value={details.password}/>
            </div>
            <input type="submit" value="LOGIN"/>
        </div>
        
    </form>
  )
}

export default LoginForm;