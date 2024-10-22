
import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';


function About(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail"); // Merr emailin nga localStorage
        if (userEmail) {
            setIsLoggedIn(true);
            console.log("User email:", userEmail); // Shfaq emailin në console
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Heq emailin nga localStorage
        setIsLoggedIn(false); // Vendos isLoggedIn në false
        navigate('/');
    };

    return (
        <div>
            <Navbar expand="lg" className="bg-danger mb-3">
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
            <h2>eee</h2>
        </div>
    );
}

export default About;
