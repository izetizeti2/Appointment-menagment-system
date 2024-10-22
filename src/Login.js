import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
 

function Login() {
    const  [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const [errors, setErrors] = useState({})

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setIsLoggedIn(true);
        }
    }, []);

    

    const handleInput = (event) => {
        setValues(prev =>({...prev, [event.target.name]: [event.target.value]}))
    };

    const handleLogout = () => {
        setValues({ email: '', password: '' });
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if (errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login',values)
            .then(res => {
                if(res.data === "success"){
                    localStorage.setItem("user", JSON.stringify(values));
                    localStorage.setItem("userEmail", values.email); // Ruaj emailin në localStorage
                    setIsLoggedIn(true);
                    navigate('/Home');
                } else {
                    alert("no record exist ");
                }
            })
            .catch(err => console.log(err));
        }
    }
    

    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>log in</h2>
                <form action=''onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' placeholder='Enter Email' name='email'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>password</label>
                        <input type='password' placeholder='Enter password'name='password'
                        onChange={handleInput} className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}

                    </div>
                    <button type='submit' className='btn btn-success w-100'>Log in</button>
                    <p>your are agree to aous terms</p>
                    <Link to="/Signup" className='btn btn-success w-100'>Sign up</Link>

                </form>
            </div>

        </div>
    )
}

export default Login;