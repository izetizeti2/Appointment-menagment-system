import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom'
import Validation from "./SignupValidation";
import axios from "axios";

function Signup (){
    const  [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const [errors,setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev =>({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if (errors.name === "" && errors.email === "" && errors.password === "") {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/');
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        // Nëse kthehet një gabim 400 (Bad Request) nga serveri, shfaq mesazhin për përdoruesin
                        alert("This email is already in use. Please use a different email.");
                    } else {
                        console.log(err);
                    }
                });
        }
    }
    

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign up</h2>
                <form action='' onSubmit={handleSubmit}>
                <div className='mb-3'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' placeholder='Enter name' name="name"
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' placeholder='Enter Email'name="email"
                         onChange={handleInput} className='form-control rounded-0'/>
                         {errors.email && <span className='text-danger'>{errors.email}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>password</label>
                        <input type='password' placeholder='Enter password' name="password"
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}

                    </div>
                    <button type="submit" className='btn btn-success w-100'>Sign up</button>
                    <p>your are agree to aous terms</p>
                    <Link to="/" className='btn btn-success w-100'>Login</Link>

                </form>
            </div>

        </div>

        
    )
            
    
}

export default Signup;