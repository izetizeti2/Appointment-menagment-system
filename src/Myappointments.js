import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Myappointments() {

    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail"); // Merr emailin nga localStorage
        if (userEmail) {
            setIsLoggedIn(true);
            console.log("User email:", userEmail); // Shfaq emailin në console
        }
    }, []);
    

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userEmail = localStorage.getItem("userEmail"); // Merrni emailin e personit të kyqur nga localStorage
                const response = await axios.get(`http://localhost:8081/appointments?email=${userEmail}`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (isLoggedIn) {
            fetchAppointments();
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Heq emailin nga localStorage
        setIsLoggedIn(false); // Vendos isLoggedIn në false
        navigate('/');
    };

    const handleDelete = async (appointmentId) => {
        try {
            await axios.delete(`http://localhost:8081/appointments/${appointmentId}`);
            // Përditësoni listën e terminave pas fshirjes së një termini
            const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
            setAppointments(updatedAppointments);
            console.log("Appointment deleted successfully");
        } catch (error) {
            console.error('Error deleting appointment:', error);
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
            <div>
                <h2>My Appointments</h2>
                {appointments.length > 0 ? (
                    <table className="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.name}</td>
                                    <td>{appointment.email}</td>
                                    <td>{moment(appointment.date).format('DD-MM-YYYY')}</td> {/* Përdor moment.js për të formatuar datën */}
                                    <td>{appointment.time}</td>
                                    <td><button className='btn btn-danger' onClick={() => handleDelete(appointment.id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h3>No appointments scheduled</h3>
                )}
            </div>
        </div>
    );
}

export default Myappointments;
