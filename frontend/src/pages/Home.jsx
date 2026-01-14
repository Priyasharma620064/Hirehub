import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import api from '../utils/api';

function Home() {
    const [featuredJobs, setFeaturedJobs] = useState([]);

    useEffect(() => {
        fetchFeaturedJobs();
    }, []);

    const fetchFeaturedJobs = async () => {
        try {
            const response = await api.get('/jobs?limit=6');
            setFeaturedJobs(response.data.slice(0, 6));
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="text-center mx-auto">
                            <h1 className="hero-title">Find Your Dream Job or Hire the Best Talent</h1>
                            <p className="hero-subtitle">
                                Connect with top companies and talented professionals on HireHub
                            </p>
                            <div className="mt-4">
                                <Link to="/jobs">
                                    <Button variant="light" size="lg" className="me-3">
                                        <i className="bi bi-search me-2"></i>Find Jobs
                                    </Button>
                                </Link>
                                <Link to="/register/employer">
                                    <Button variant="outline-light" size="lg">
                                        <i className="bi bi-briefcase me-2"></i>Post a Job
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* How It Works */}
            <div className="how-it-works">
                <Container>
                    <h2 className="section-title text-center">How It Works</h2>

                    <Row className="mb-5">
                        <Col className="text-center mb-4">
                            <h4 className="mb-4">For Job Seekers</h4>
                        </Col>
                    </Row>

                    <Row className="mb-5">
                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-person-plus"></i>
                            </div>
                            <h5>Create Profile</h5>
                            <p className="text-muted">Sign up and build your professional profile with skills and resume</p>
                        </Col>

                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h5>Search Jobs</h5>
                            <p className="text-muted">Browse thousands of job opportunities that match your skills</p>
                        </Col>

                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-send-check"></i>
                            </div>
                            <h5>Apply & Track</h5>
                            <p className="text-muted">Apply with one click and track your application status</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="text-center mb-4">
                            <h4 className="mb-4">For Employers</h4>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-building"></i>
                            </div>
                            <h5>Create Company Profile</h5>
                            <p className="text-muted">Showcase your company and attract top talent</p>
                        </Col>

                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>
                            <h5>Post Jobs</h5>
                            <p className="text-muted">Create detailed job listings to find the perfect candidates</p>
                        </Col>

                        <Col md={4} className="text-center mb-4">
                            <div className="feature-icon">
                                <i className="bi bi-people"></i>
                            </div>
                            <h5>Manage Applicants</h5>
                            <p className="text-muted">Review applications and hire the best talent</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Featured Jobs */}
            <Container className="my-5">
                <h2 className="section-title text-center">Featured Jobs</h2>
                <Row>
                    {featuredJobs.map(job => (
                        <Col md={6} lg={4} key={job._id} className="mb-4">
                            <JobCard job={job} />
                        </Col>
                    ))}
                </Row>

                {featuredJobs.length > 0 && (
                    <div className="text-center mt-4">
                        <Link to="/jobs">
                            <Button variant="primary" size="lg">View All Jobs</Button>
                        </Link>
                    </div>
                )}
            </Container>

            {/* Why HireHub */}
            <div className="bg-light py-5">
                <Container>
                    <h2 className="section-title text-center">Why Choose HireHub?</h2>
                    <Row>
                        <Col md={3} className="text-center mb-4">
                            <Card className="custom-card h-100">
                                <Card.Body>
                                    <i className="bi bi-lightning-charge feature-icon"></i>
                                    <h5>Fast & Easy</h5>
                                    <p className="text-muted">Quick application process with just a few clicks</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} className="text-center mb-4">
                            <Card className="custom-card h-100">
                                <Card.Body>
                                    <i className="bi bi-shield-check feature-icon"></i>
                                    <h5>Verified Companies</h5>
                                    <p className="text-muted">All employers are verified for your safety</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} className="text-center mb-4">
                            <Card className="custom-card h-100">
                                <Card.Body>
                                    <i className="bi bi-graph-up feature-icon"></i>
                                    <h5>Career Growth</h5>
                                    <p className="text-muted">Find opportunities that match your career goals</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} className="text-center mb-4">
                            <Card className="custom-card h-100">
                                <Card.Body>
                                    <i className="bi bi-headset feature-icon"></i>
                                    <h5>24/7 Support</h5>
                                    <p className="text-muted">Our team is always here to help you succeed</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
