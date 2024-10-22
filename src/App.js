import React from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from "./Signup";
import Home from "./Home";
import About from "./About";
import Appointment from "./Appointment";
import Myappointments from "./Myappointments";
import Changename from "./Changename";
import Changepassword from './Changepassword';
import Admin from './Admin';
import Adminhome from "./Adminhome";
import Adminappointments from "./Adminappointments";

function App() {
  return (
    <div >
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/About' element={<About />} />
            <Route path='/Appointment' element={<Appointment />} />
            <Route path='/Myappointments' element={<Myappointments />} />
            <Route path='/Changename' element={<Changename />} />
            <Route path='/Changepassword' element={<Changepassword />} />
            <Route path='/Admin' element={<Admin />} />
            <Route path='/Adminhome' element={<Adminhome />} />
            <Route path='/Adminappointments' element={<Adminappointments />} />
            
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
