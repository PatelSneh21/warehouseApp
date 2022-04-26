import React, { useState } from 'react';

import Logo from '../assets/bvlogo.png';


function LoginForm({ Login, error }) {
    const [details, setDetails] = useState({email: "", password:""});

    const submitHandler = event => {
        event.preventDefault();

        Login(details);
    }
  return (
      <div className='form-wrapper'>
        <form onSubmit = {submitHandler}>
            <div className="form-inner">
                <img src={Logo} />
                <div className="form-group">
                    <label htmlFor="email">Username:</label>
                    <input type="text" name="email" id="email" onChange={event => setDetails({...details, email: event.target.value})} value={details.email}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={event => setDetails({...details, password: event.target.value})} value={details.password}/>
                </div>
            {(error != "") ? ( <div className="error">Incorrect username or password</div>) : ""}
                <input type="submit" value="LOGIN"/>
            </div>
        </form>
      </div>
  )
}

export default LoginForm;