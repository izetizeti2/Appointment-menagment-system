import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';

function Adminhome() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
            setIsLoggedIn(true);
            console.log("User email:", userEmail);
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/adminusers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (isLoggedIn) {
            fetchUsers();
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        navigate('/Admin');
    };
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:8081/users/${userId}`);
            // Përditësoni listën e përdoruesve pas fshirjes së një përdoruesi
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            console.log("User deleted successfully");
        } catch (error) {
            console.error('Error deleting user:', error);
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
                                        <NavDropdown.Item href="#action/3.1">Change Name</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Change Password</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/admin" onClick={handleLogout}>Logout</NavDropdown.Item>
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
                <h2>Admin Users</h2>
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><button className='btn btn-danger'onClick={() => handleDelete(user.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Adminhome;
