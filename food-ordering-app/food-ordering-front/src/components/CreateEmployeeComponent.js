import React, {useState, useEffect} from 'react'
import UserService from '../services/UserService'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Swal from 'sweetalert2'

const CreateEmployeeComponent = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')

  //za update
  const {id} = useParams();

  const navigate = useNavigate();

  //ako postoji id, znaci da se radi izmena i prvo se setuju podaci dobijeni od servera
  useEffect(() => {
    id && UserService.getEmployeeById(id).then((response) =>{
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phoneNumber);
      setUsername(response.data.username);
      setPassword(response.data.password);
      setAddress(response.data.address);
    }).catch(error =>{
      console.log(error)
    })
  }, [])

  const createOrUpdateEmployee = (e) => {
    e.preventDefault();

    const user = {firstName, lastName, email, username, phoneNumber, password, address}
    
    if(firstName.trim() === '' || lastName.trim() === ''
      || email.trim() === '' || username.trim() === '' || phoneNumber.trim() === '' 
      || password.trim() === '' || address.trim() === ''){
       alertInvalid("invalidInput")
    }
    else if (validateEmail() == false){
        alert("Invalid email!");
    }
    else{
      //ako id postoji, odnosno ako je prosledjen radi se izmena postojeceg
      if(id){
        UserService.updateEmployee(id, user).then((response) =>{
          if(response.data.toString() == "success"){
            alertSuccess();
            navigate("/employees");
          }
          else if(response.data.toString() == "invalidInput"){
            alertInvalid(response.data.toString());
          }
          else if(response.data.toString() == "emailAlreadyExist"){
            alertInvalid(response.data.toString());
          }
        }).catch(error =>{
          console.log(error);
        })
      }
      //ako nije prosledjen id, radi se kreiranje novog
      else{
        UserService.createEmployee(user).then((response) =>{
          console.log(response.data);
          if(response.data.toString() == "success"){
            alertSuccess();
            navigate("/employees");
          }
          else if(response.data.toString() == "invalidInput"){
            alertInvalid(response.data.toString());
          }
          else if(response.data.toString() == "emailOrUsernameAlreadyExist"){
            alertInvalid(response.data.toString());
          }
        }).catch(error =>{
          console.log("Error: " + error);
        })
      } 
    }
  }

  const alertSuccess = () =>{
    if(id){
      var titleContent = 'Successfully updated employee!';
    }
    else{
      var titleContent = 'Successfully added employee!';
    }
    Swal.fire({
      position: 'top',
      icon: 'success',
      //title: 'Successfully added employee!',
      title: titleContent,
      showConfirmButton: false,
      timer: 1500
    });
  }

  const validateEmail = () => {
    //treba bez ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const alertInvalid = (invalidText) =>{
    if(invalidText == "invalidInput"){
      var titleContent = "Invalid input, make sure everything is filed correctly and try again!";
    }
    else if(invalidText == "emailOrUsernameAlreadyExist"){
      var titleContent = "Username or email already exist, try again!";
    }
    else if(invalidText == "emailAlreadyExist"){
      var titleContent = "Email already exist, try again!";
    }
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: titleContent,
    })
  }

const title = () => {
  if(id){
    return <h2 className='text-center'>Update employee</h2>
  }
  else{
    return <h2 className='text-center'>Create employee</h2>
  }
}
//ako postoji id, odnosno ako je izmena, disabluje se input
const usernameInput = () => {
  if(id){
    return <input  
              type="text"
              placeholder="Insert username" 
              name = "username" 
              className="form-control" 
              value={username}
              onChange = {(e) => setUsername(e.target.value)}
              disabled = {true}
              > 
            </input>
  }
  else{
    return <input  
              type="text"
              placeholder="Insert username" 
              name = "username" 
              className="form-control" 
              value={username}
              onChange = {(e) => setUsername(e.target.value)}
            >
            </input>
  }
}

  return (
    <div>
      <br/> 
        <div className='container-add-employee'>
          <div className='row'>
            <div className='card col-md-6 offset-md-3 offset-md-3'>
              {
                title()
              }
              <div className='card-body'>
                <form>
                  <div className='form-group mb-2'>
                    <label className='form-label'>First name: </label>
                    <input  
                        type="text"
                        placeholder="Insert first name" 
                        name = "firstName" 
                        className="form-control" 
                        value={firstName}
                        onChange = {(e) => setFirstName(e.target.value)}
                        >     
                    </input>
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Last name: </label>
                    <input  
                        type="text"
                        placeholder="Insert last name" 
                        name = "lastName" 
                        className="form-control" 
                        value={lastName}
                        onChange = {(e) => setLastName(e.target.value)}
                        > 
                    </input>
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Email: </label>
                    <input  
                        type="text"
                        placeholder="Insert email" 
                        name = "email" 
                        className="form-control" 
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                        >    
                    </input>
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Phone number: </label>
                    <input  
                        type="text"
                        placeholder="Insert phone number" 
                        name = "phoneNumber" 
                        className="form-control" 
                        value={phoneNumber}
                        onChange = {(e) => setPhoneNumber(e.target.value)}
                        >   
                    </input>
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Username: </label>
                    {
                      usernameInput()
                    }
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Password: </label>
                    <input  
                        type="text"
                        placeholder="Insert password" 
                        name = "password" 
                        className="form-control" 
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                        >
                    </input>
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Address: </label>
                    <input  
                        type="text"
                        placeholder="Insert address" 
                        name = "address" 
                        className="form-control" 
                        value={address}
                        onChange = {(e) => setAddress(e.target.value)}
                        >
                    </input>
                  </div>

                  <button className='btn btn-success' onClick={(e) => createOrUpdateEmployee(e)}>Submit</button>
                  <Link to="/employees" className='btn btn-danger' style={{marginLeft:"5px"}}>Cancel</Link>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CreateEmployeeComponent