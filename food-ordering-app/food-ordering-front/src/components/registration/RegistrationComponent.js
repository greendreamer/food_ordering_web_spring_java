import React, {useState} from 'react'
import Swal from 'sweetalert2'
import {Link, useNavigate, useParams} from 'react-router-dom'
import UserService from '../../services/UserService'
import './RegistrationComponent.css' // da se importuje css, bez ovog ne radi 

const RegistrationComponent = () => {

const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [phoneNumber, setPhoneNumber] = useState('')
const [password, setPassword] = useState('')
const [address, setAddress] = useState('')

const navigate = useNavigate();

const createUser = (e) => {
    e.preventDefault(); // da se ne bi osvezavala stranica svaki put kad se form submituje, tako kaze indijac na yt
    const user = {firstName, lastName, email, username, phoneNumber, password, address}
    //validacija unosa
    if(firstName.trim() === '' || lastName.trim() === ''
      || email.trim() === '' || username.trim() === '' || phoneNumber.trim() === '' 
      || password.trim() === '' || address.trim() === ''){
       alertInvalid("Invalid input, make sure everything is filed correctly and try again!")
    }
    else if (validateEmail() == false){
        alertInvalid("Invalid email! Make sure email is valid and try again!");
    }
    else if(!isValidNumber(phoneNumber)){
        alertInvalid("Invalid phone number or it has less than 5 digits");
    }
    else{
      UserService.createUser(user).then((response) =>{
        console.log(response.data);
        if(response.data.toString() == "success"){
          alertSuccess("Successfully registered!");
          navigate("/login");
        }
        else if(response.data.toString() == "invalidInput"){
          alertInvalid("Invalid input, make sure everything is filed correctly and try again!");
        }
        else if(response.data.toString() == "emailOrUsernameAlreadyExist"){
          alertInvalid("Email or username already exists! Try again!");
        }
      }).catch(error =>{
        console.log("Error: " + error);
      })
    }
}

  const alertSuccess = (message) =>{  
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  const validateEmail = () => {
    //treba bez ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const alertInvalid = (message) =>{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    })
  }

  const isValidNumber = (input) => {
    // ^\d{5,}$: Uses a regular expression to ensure that the input consists of at least 5 digits. 
    // Here's a breakdown:
    // ^: Asserts the start of the string.
    // \d{5,}: Matches at least 5 digits (\d is a shorthand for a digit, and {5,} means at least 5 occurrences).
    // $: Asserts the end of the string.
    if(isNaN(input) || /^\d{5,}$/.test(input) === false){
      return false;
    }
    else{
      return true;
    }
  }

  return (
    <div class="registration-main-container">
            <div className='card-registration'>
              {
               <h2 className='text-center'>Registration</h2>
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
                      <input  
                      type="text"
                      placeholder="Insert username" 
                      name = "username" 
                      className="form-control" 
                      value={username}
                      onChange = {(e) => setUsername(e.target.value)}
                      >
                      </input>
                    }
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>Password: </label>
                    <input  
                        type="password"
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
                  <button id='registrationBtn' className='btn btn-success mt-2' onClick={(e) => createUser(e)}>Submit</button>
                  <Link to="/employees" className='btn btn-danger mt-2' style={{marginLeft:"5px"}}>Cancel</Link>
                </form>
              </div>
          
        </div>    
    </div>
  )
}

export default RegistrationComponent