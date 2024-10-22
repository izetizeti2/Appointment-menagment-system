import React, { useState, useEffect } from 'react'; 
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Validation from './AppointmentValidation';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Style.css';



function Appointment() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]); // Shto një gjendje për orët e disponueshme

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail"); // Merr emailin nga localStorage
        if (userEmail) {
            setValues(prev => ({...prev, email: userEmail})); // Vendos emailin në gjendjen e vlerave
            setIsLoggedIn(true);
            console.log("User email:", userEmail); // Shfaq emailin në console
        }
    }, []);
    

    useEffect(() => {
        const fetchBookedTimes = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/booked-times?date=${selectedDate}`);
                const bookedTimes = response.data.map(time => {
                    // Normalizo formatin e orës
                    const [hour, minute, _] = time.split(':');
                    return `${hour}:${minute}`;
                });
                const allTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
                const availableTimes = allTimes.filter(time => !bookedTimes.includes(time)); // Filtroni orët e disponueshme
                setAvailableTimes(availableTimes); // Përditëso gjendjen për orët e disponueshme
            } catch (error) {
                console.error('Gabim në marrjen e orëve të zëna:', error);
            }
        };
        
        if (selectedDate) {
            fetchBookedTimes();
        }
    }, [selectedDate]);
    
    
    

    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Heq emailin nga localStorage
        setIsLoggedIn(false); // Vendos isLoggedIn në false
        navigate('/');
    };

    const  [values, setValues] = useState({
        name: '',
        email: '',
        date: '',
        time: '' 
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
    
        // Kontrolli i kufizimeve për datën e zgjedhur
        const selectedDateObj = new Date(values.date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const endOfYear = new Date(tomorrow.getFullYear(), 11, 31); // Mbas 31 dhjetorit të vitit aktual
    
        if (selectedDateObj <= tomorrow || selectedDateObj > endOfYear) {
            // Data është para nesër ose pas fundit të vitit aktual
            setErrors(prev => ({
                ...prev,
                date: "Data e zgjedhur duhet të jetë nimimumi 2 dit para dhe maksimumi deri ne fundit të vitit."
            }));
            return; // Ndalo dërgimin e formës
        }
    
        if (errors.name === "" && errors.email === "" && errors.date === "") {
            axios.post('http://localhost:8081/Appointment', values)
            .then(res => {
                setSelectedTime(null); 
                navigate('/Home');
            })
            .catch(err => console.log(err));
        }
    };
    

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        setValues(prev => ({...prev, time: time}));
    };

    const renderTimeTable = () => {
        if (selectedDate) {
            return (
                <div>
                    <h6>Zgjidhni orën për : {selectedDate}</h6>
                    <div className="row">
                        {availableTimes.map((hour, index) => (
                            <div key={index} className="col-3 mb-2">
                                <button 
                                    className={`btn btn-sm btn-form-buttons ${selectedTime === hour ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleTimeSelection(hour)}
                                >
                                    {hour}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };
    

    return (
        <div>
            <Navbar expand="lg" className="bg-primary mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar-expand-lg"
                        aria-labelledby="offcanvasNavbarLabel-expand-lg"
                        placement="end"
                    >
                        <Offcanvas.Body>
                            <Nav className="justify-content-center flex-grow-1 pe-3">
                                <Nav.Link href="/Home">Home</Nav.Link>
                                <Nav.Link href="/About">About</Nav.Link>
                                <Nav.Link href="/Appointment">Appointment</Nav.Link>
                                <Nav.Link href="/Myappointments">My Appointments</Nav.Link>
                            </Nav>
                            {isLoggedIn ? (
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                                    <Nav.Link>Profile</Nav.Link>
                                </Nav>
                            ) : (
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="/">Login</Nav.Link>
                                    <Nav.Link href="/Signup">Signup</Nav.Link>
                                </Nav>
                            )}
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
                <div className='bg-white p-3 rounded w-25'>
                    <h2>Appointment</h2>
                    <form action='' onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='name'>Name</label>
                            <input type='text' placeholder='Enter name' name="name"
                            onChange={handleInput} className='form-control rounded-0'/>
                            {errors.name && <span className='text-danger'>{errors.name}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='email'>Email</label>
                            <input type='email' placeholder='Enter Email'name="email" value={values.email} readOnly
                            onChange={handleInput} className='form-control rounded-0'/>
                            {errors.email && <span className='text-danger'>{errors.email}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='date'>Date</label>
                            <input type='date' placeholder='Enter date' name="date" 
                            onChange={(e) => {
                             setSelectedDate(e.target.value);
                            setValues(prev => ({...prev, date: e.target.value}));
                                }}
                             className='form-control rounded-0'/>
                            {errors.date && <span className='text-danger'>{errors.date}</span>}
                        </div>
                        {renderTimeTable()}
                        <button type="submit" className='btn btn-success w-100 mt-3'>Appointment</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Appointment;
