import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';

function SeekerDashboard() {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        shortlisted: 0,
        rejected: 0
    });

    useEffect(() => {
        fetchProfile();
        fetchApplications();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            setApplications(response.data);

            setStats({
                total: response.data.length,
                applied: response.data.filter(app => app.status === 'Applied').length,
                shortlisted: response.data.filter(app => app.status === 'Shortlisted').length,
                rejected: response.data.filter(app => app.status === 'Rejected').length
            });
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Job Seeker Dashboard</h2>

            {/* Profile Summary */}
            <Card className="custom-card mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h4>{user?.name}</h4>
                            <p className="text-muted mb-2">
                                <i className="bi bi-envelope me-2"></i>{user?.email}
                            </p>
                            {user?.skills && user.skills.length > 0 && (
                                <p className="mb-2">
                                    <strong>Skills:</strong> {user.skills.join(', ')}
                                </p>
                            )}
                            {user?.education && (
                                <p className="mb-0">
                                    <strong>Education:</strong> {user.education}
                                </p>
                            )}
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Link to="/seeker/profile">
                                <Button variant="outline-primary">
                                    <i className="bi bi-pencil me-2"></i>Edit Profile
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Application Statistics */}
            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="file-earmark-text"
                        number={stats.total}
                        label="Total Applications"
                        color="primary"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="clock-history"
                        number={stats.applied}
                        label="Applied"
                        color="secondary"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="check-circle"
                        number={stats.shortlisted}
                        label="Shortlisted"
                        color="success"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="x-circle"
                        number={stats.rejected}
                        label="Rejected"
                        color="danger"
                    />
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card className="custom-card">
                <Card.Body>
                    <h5 className="mb-4">Quick Actions</h5>
                    <Row>
                        <Col md={4} className="mb-3">
                            <Link to="/jobs" className="text-decoration-none">
                                <Card className="text-center h-100" style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                        <i className="bi bi-search feature-icon" style={{ fontSize: '2.5rem' }}></i>
                                        <h6 className="mt-2">Browse Jobs</h6>
                                        <p className="text-muted small">Find your next opportunity</p>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Link to="/seeker/applications" className="text-decoration-none">
                                <Card className="text-center h-100" style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                        <i className="bi bi-list-check feature-icon" style={{ fontSize: '2.5rem' }}></i>
                                        <h6 className="mt-2">My Applications</h6>
                                        <p className="text-muted small">Track application status</p>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Link to="/seeker/profile" className="text-decoration-none">
                                <Card className="text-center h-100" style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                        <i className="bi bi-person-circle feature-icon" style={{ fontSize: '2.5rem' }}></i>
                                        <h6 className="mt-2">Update Profile</h6>
                                        <p className="text-muted small">Keep your profile updated</p>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SeekerDashboard;
