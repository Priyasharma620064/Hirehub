import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

function NavigationBar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <Navbar bg="white" expand="lg" className="navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <i className="bi bi-briefcase-fill me-2"></i>
                    HireHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/jobs">Browse Jobs</Nav.Link>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Link to="/register/seeker">
                                    <Button variant="primary" size="sm" className="ms-2">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {user.role === 'seeker' && (
                                    <>
                                        <Nav.Link as={Link} to="/jobs">Browse Jobs</Nav.Link>
                                        <Nav.Link as={Link} to="/seeker/applications">My Applications</Nav.Link>
                                        <Nav.Link as={Link} to="/seeker/dashboard">Dashboard</Nav.Link>
                                    </>
                                )}

                                {user.role === 'employer' && (
                                    <>
                                        <Nav.Link as={Link} to="/employer/jobs">My Jobs</Nav.Link>
                                        <Nav.Link as={Link} to="/employer/post-job">Post Job</Nav.Link>
                                        <Nav.Link as={Link} to="/employer/dashboard">Dashboard</Nav.Link>
                                    </>
                                )}

                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                                )}

                                <NavDropdown title={user.name} id="user-dropdown" align="end">
                                    <NavDropdown.Item onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
