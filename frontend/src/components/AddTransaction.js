import React, {useState, useEffect} from 'react'
// We import NavLink to utilize the react router.
import { NavLink, useLocation} from "react-router-dom";

function AddTransaction() {

  const {state} = useLocation();

  let userData = {
    "username" : state.username
  }

    const [invItem, setInvItem] = useState({
        form_type:"Deposit",
        model_number: "",
        rack_location:"",
        bin_location:"",
        num_cartons:"",
        revenue:"",
        tax_collected:"",
        customer_name:"",
        sample:false,
        user: userData["username"]
      });

    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    //const [formType, setFormType] = useState("Deposit");

      // These methods will update the state properties.
      const handleChange = (e) => {
        setSucess("")
        setError("")
        const item = e.target.name;
        const value = e.target.value;
        setInvItem(values => ({...values, [item]:value}))
        //console.log(invItem)
      }

      const handleSampleChange = (e) => {
        setSucess("")
        setError("")
        const isChecked = invItem.sample;
        setInvItem(values => ({...values, ['sample']:!isChecked}))
        //console.log(invItem)
      }

      function onChangeForm(e) {
        setSucess("")
        setError("")
        const newFormType = e.target.value;
        setInvItem(values => ({...values, ['form_type']:newFormType}))
      }

// This function will handle the submission.
    function onSubmit(e) {
        e.preventDefault();
        console.log(invItem)
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addTransaction',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(invItem)
        }).then(response => {
            if ( response.ok ){
              setInvItem({
                form_type:"Deposit",
                model_number: "",
                rack_location:"",
                bin_location:"",
                num_cartons:"",
                revenue:"",
                tax_collected:"",
                customer_name:"",
                sample:false,
                user: userData["username"]
              });
              setSucess("Item successfully added");
            } else {
              setError("Error adding item, please try again");
            }
        }).catch((err) => {
          console.log(err);
          setError("Error adding bin, please try again");
      });
    }

    

    return (
        <div className="create-content">

            <div className='result-card'>
            <form onSubmit={onSubmit} class="form-horizontal">
                <fieldset>

                <legend>Create New Transaction</legend>

                <div class="form-group">
                <label class="col-md-4 control-label" for="radios">Transaction Type</label>
                <div class="col-md-8" onChange={onChangeForm}> 
                    <label class="radio-inline" for="radios-0">
                    <input type="radio" name="radios" class='radio-input' id="radios-0" value="Deposit" defaultChecked/>
                    Deposit
                    </label> 
                    <label class="radio-inline" for="radios-1">
                    <input type="radio" name="radios" id="radios-1" value="Withdrawal"/>
                    Withdrawal
                    </label>
                </div>
                </div>


                <div class="form-group">
                <label class="col-md-4 control-label" for="form_model_number">Model Number</label>  
                <div class="col-xl-12">
                <input id="form_model_number" onChange={handleChange} name="model_number" value = {invItem.model_number} type="text" placeholder="" class="form-control input-md" required=""/>
                    
                </div>
                </div>

                <div class="form-group">
                <label class="col-md-4 control-label" for="form_num_cartons">Number of Cartons</label>  
                <div class="col-xl-12">
                <input id="form_num_cartons" onChange={handleChange} name="num_cartons" value = {invItem.num_cartons} type="number" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>

                <div class="form-group">
                <label class="col-md-4 control-label" for="form_rack_info">Rack Number</label>  
                <div class="col-xl-12">
                <input id="form_rack_info" onChange={handleChange} name="rack_location" value = {invItem.rack_location} type="text" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>


                <div class="form-group">
                <label class="col-md-4 control-label" for="form_bin_info">Bin Number</label>  
                <div class="col-xl-12">
                <input id="form_bin_info" onChange={handleChange} name="bin_location" value = {invItem.bin_location} type="text" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>

                {(invItem.form_type == "Withdrawal" && !invItem.sample) &&

                
                <div>
                <div class="form-group">
                <label class="col-md-4 control-label" for="form_revenue">Revenue</label>  
                <div class="col-xl-12">
                <input id="form_revenue" onChange={handleChange} name="revenue" value = {invItem.revenue} type="number" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>


                <div class="form-group">
                <label class="col-md-4 control-label" for="form_tax_collected">Tax Collected</label>  
                <div class="col-xl-12">
                <input id="form_tax_collected" onChange={handleChange} name="tax_collected" value = {invItem.tax_collected} type="number" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>


                <div class="form-group">
                <label class="col-md-4 control-label" for="form_customer_name">Customer Name</label>  
                <div class="col-xl-12">
                <input id="form_customer_name" onChange={handleChange} name="customer_name" value = {invItem.customer_name} type="text" placeholder="" class="form-control input-md"/>
                    
                </div>
                </div>
                </div>
                }

                {invItem.form_type == "Withdrawal" &&
                  <div class="form-group">
                  <label class="col-md-4 control-label" for="form_sample"></label>
                  <div class="col-xl-12">
                      <label class="checkbox-inline" for="form_sample-0">
                      <input type="checkbox" onChange={handleSampleChange} name="sample" checked={invItem.sample} id="form_sample-0" value="Sample"/>
                      Sample
                      </label>
                  </div>
                  </div>
                }

                <div class="form-group">
                <label class="col-md-4 control-label" for="Submit"></label>
                <div class="col-xl-12">
                    <button id="Submit" name="Submit" class="btn btn-primary">Submit</button>
                </div>
                </div>

                    {(success != "") ? ( <div className="successMsg">{success}</div>) : ""}
                    {(error != "") ? ( <div className="error">{error}</div>) : ""}

                </fieldset>
            </form>

            </div>
        </div>
      )
}

export default AddTransaction;

