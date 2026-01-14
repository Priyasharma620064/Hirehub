import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import api from '../utils/api';

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchJobDetails();
        if (user.role === 'seeker') {
            checkApplicationStatus();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            const applied = response.data.some(app => app.job._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error('Error checking application status:', error);
        }
    };

    const handleApply = async () => {
        if (!user.role || user.role !== 'seeker') {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await api.post('/applications', { jobId: id });
            setMessage('Application submitted successfully!');
            setHasApplied(true);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to apply');
        } finally {
            setLoading(false);
        }
    };

    if (!job) {
        return (
            <Container className="my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/jobs')}>
                <i className="bi bi-arrow-left me-2"></i>Back to Jobs
            </Button>

            {message && <Alert variant="info">{message}</Alert>}

            <Row>
                <Col lg={8}>
                    <Card className="custom-card mb-4">
                        <Card.Body>
                            <h2 className="mb-3">{job.title}</h2>
                            <h5 className="text-muted mb-4">{job.companyName}</h5>

                            <div className="mb-4">
                                <span className="me-4">
                                    <i className="bi bi-geo-alt me-2"></i>{job.location}
                                </span>
                                <span className="me-4">
                                    <i className="bi bi-cash me-2"></i>{job.salary}
                                </span>
                                <span>
                                    <i className="bi bi-briefcase me-2"></i>{job.jobType}
                                </span>
                            </div>

                            <div className="mb-4">
                                {job.skills?.map((skill, index) => (
                                    <Badge key={index} bg="primary" className="me-2 mb-2">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>

                            <hr />

                            <h5 className="mb-3">Job Description</h5>
                            <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

                            <hr />

                            <h5 className="mb-3">Skills Required</h5>
                            <ul>
                                {job.skills?.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="custom-card sticky-top" style={{ top: '20px' }}>
                        <Card.Body>
                            <h5 className="mb-4">About Company</h5>
                            <p><strong>{job.companyName}</strong></p>
                            {job.employer?.companyDescription && (
                                <p className="text-muted">{job.employer.companyDescription}</p>
                            )}

                            <hr />

                            <div className="mb-3">
                                <small className="text-muted">Posted on</small>
                                <p className="mb-0">{new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>

                            {user.role === 'seeker' && (
                                <>
                                    {hasApplied ? (
                                        <Button variant="secondary" className="w-100" disabled>
                                            <i className="bi bi-check-circle me-2"></i>Already Applied
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            className="w-100"
                                            onClick={handleApply}
                                            disabled={loading}
                                        >
                                            {loading ? 'Applying...' : 'Apply Now'}
                                        </Button>
                                    )}
                                </>
                            )}

                            {!user.role && (
                                <Button variant="primary" className="w-100" onClick={() => navigate('/login')}>
                                    Login to Apply
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default JobDetails;
