import React, {useState, useEffect} from 'react'

// We import NavLink to utilize the react router.
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button } from "react-bootstrap";

const Bin = (props) => (
    <tr>
      <td>{props.bin["bin_location"]}</td>
      <td>{props.bin["bin_height"]}</td>
      <td>{props.bin["rack_location"]}</td>
      {/* <td>
        <Button variant="primary"
        onClick={() => handleEdit(props)}
        >edit</Button>
      </td> */}
      {/* <td>
        <Button variant="primary"
        onClick={() => handleDelete(props)}>delete</Button>
      </td> */}
    </tr>
  );

function ManageBins() {

    // state for displaying all bins
    const [allBins, setAllBins] = useState({
        allBins: [{
            bin_id:"",
            bin_height: "",
            bin_location: "",
            rack_location:"",
    }]});

    // state for adding a new bin
    const [newBin, setNewBin] = useState({
        bin_height: "",
        bin_location: "",
        rack_location:"",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [success, setSucess] = useState("");
    const {state} = useLocation();
    let userData = {
      "username" : state.user.email
    }
    const navigate = useNavigate();
    

    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allBins',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(userData)
        }).then(response => response.json())  
        .then(data => {
          setAllBins({allBins: data.bins});
        })
        .catch(error => console.log(error));
    }, []);

      // These methods will update the state properties.
      const handleChange = (e) => {
        setSucess("")
        setError('')
        const item = e.target.name;
        const value = e.target.value;
        setNewBin(values => ({...values, [item]:value}))
        //console.log(newBin)
      }

      const handleBack = () => {
        navigate('../manage', {replace:true, state: state})
      }


      function binList(collection) {
        return collection.allBins.map((currentBin) => {
            return (
            <Bin
            key={currentBin["bin_id"]}
            bin={currentBin}
            />
            );
        });
      }

// This function will handle the submission.
    function onSubmit(e) {
        e.preventDefault();


        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/addBin',
        {
          method:"POST",
          mode: 'cors',
          headers:{
              "Content-Type":"application/json",
          },
          body: JSON.stringify(newBin)
        })
        .then( async (response) => {
  
          // get json response here
          let data = await response.json();
          
          if(response.ok ){
            setNewBin({
                bin_height: "",
                bin_location: "",
                rack_location:"",
            });

            setAllBins({allBins: data.bins});
            
            setSucess("Bin successfully added");
          }else{
            setError("Error adding bin, please try again");
          }
  
        })
        .catch((err) => {
            console.log(err);
        })
    }
    

//search feature
    useEffect(() => {
        if (searchTerm !== "") {
          //'http://127.0.0.1:5000/api/searchItemModel/' + searchTerm
          //'http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchItemModel/' + searchTerm
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/searchBin/' + searchTerm)
          .then(response => response.json())
          .then(data => setAllBins({allBins: data.bins}))
          .catch(error => console.log(error));
        } else {
          fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/allBins',
            {
              method:"POST",
              mode: 'cors',
              headers:{
                  "Content-Type":"application/json",
              },
              body: JSON.stringify(userData)
            }).then(response => response.json())  
            .then(data => {
                setAllBins({allBins: data.bins});
            })
            .catch(error => console.log(error));
        }
      }, [searchTerm]);

  return (
    <div className="create-content">
    <div className="result-card">
    <h3>Create New Bin</h3>
    <form onSubmit={onSubmit}>
        <div className="form-group">
        <label>Bin Number: </label>
        <input
          type="text"
          className="form-control"
          name = "bin_location"
          value={newBin.bin_location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Bin Height: </label>
        <input
          type="text"
          className="form-control"
          name = "bin_height"
          value={newBin.bin_height}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Rack Number: </label>
        <input
          type="text"
          className="form-control"
          name = "rack_location"
          value={newBin.rack_location}
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
        <h2>All Bins</h2>

        <div className="result-card">
            <h2>Bin Summary</h2>
            
                <h5>What are you looking for?</h5>
                <input className='search-bar' type="text" placeholder="Search by bin height, number or rack number" 
                onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
            
            <Table striped borderless hover >
            <thead>
                <tr>
                  <th className="bintable-number">Bin Number</th>
                  <th className="bintable-height">Bin Height</th>
                  <th className="bintable-rack">Rack Number</th>
                </tr>
            </thead>
            <tbody>{binList(allBins)}</tbody>
            </Table>
        </div>
    </div>
  </div>
  )
}

export default ManageBins