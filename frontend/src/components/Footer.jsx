import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="custom-footer">
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5 className="mb-3">HireHub</h5>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Connecting talented professionals with amazing opportunities.
                        </p>
                    </Col>

                    <Col md={2} className="mb-4">
                        <h6 className="mb-3">For Job Seekers</h6>
                        <ul className="list-unstyled">
                            <li><a href="/jobs" className="footer-link">Browse Jobs</a></li>
                            <li><a href="/register/seeker" className="footer-link">Register</a></li>
                        </ul>
                    </Col>

                    <Col md={2} className="mb-4">
                        <h6 className="mb-3">For Employers</h6>
                        <ul className="list-unstyled">
                            <li><a href="/employer/post-job" className="footer-link">Post a Job</a></li>
                            <li><a href="/register/employer" className="footer-link">Register</a></li>
                        </ul>
                    </Col>

                    <Col md={2} className="mb-4">
                        <h6 className="mb-3">Company</h6>
                        <ul className="list-unstyled">
                            <li><a href="#" className="footer-link">About Us</a></li>
                            <li><a href="#" className="footer-link">Contact</a></li>
                        </ul>
                    </Col>

                    <Col md={2} className="mb-4">
                        <h6 className="mb-3">Follow Us</h6>
                        <div className="d-flex gap-3">
                            <a href="#" className="footer-link"><i className="bi bi-linkedin fs-4"></i></a>
                            <a href="#" className="footer-link"><i className="bi bi-twitter fs-4"></i></a>
                            <a href="#" className="footer-link"><i className="bi bi-facebook fs-4"></i></a>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <Row>
                    <Col className="text-center">
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="mb-0">
                            &copy; {new Date().getFullYear()} HireHub. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
