import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';

function Adminappointments() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appointments, setAppointments] = useState([]);

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
                const response = await axios.get('http://localhost:8081/adminappointments'); // Thirr endpoint-in për të marrë terminet
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
        navigate('/Admin');
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
                                <Nav.Link href="/Adminhome">Admin Home</Nav.Link>
                                <Nav.Link href="/Adminappointments">Admin Appointments</Nav.Link>
                            </Nav>
                            {isLoggedIn ? (
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <NavDropdown title="Profile" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#action">Change Name</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Change Password</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/Admin" onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
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
                <h2>Admin Appointments</h2>
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
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td><button className='btn btn-danger'onClick={() => handleDelete(appointment.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Adminappointments;
