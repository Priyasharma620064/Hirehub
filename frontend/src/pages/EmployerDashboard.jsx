import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';

function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        shortlisted: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
        fetchStats();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/my/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const jobsResponse = await api.get('/jobs/my/jobs');
            let totalApplicants = 0;
            let shortlisted = 0;

            for (const job of jobsResponse.data) {
                try {
                    const appResponse = await api.get(`/applications/job/${job._id}`);
                    totalApplicants += appResponse.data.length;
                    shortlisted += appResponse.data.filter(app => app.status === 'Shortlisted').length;
                } catch (err) {
                    console.error('Error fetching applications for job:', job._id);
                }
            }

            setStats({
                totalJobs: jobsResponse.data.length,
                totalApplicants,
                shortlisted
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <Container className="my-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2>Employer Dashboard</h2>
                </Col>
                <Col className="text-end">
                    <Link to="/employer/post-job">
                        <Button variant="primary" size="lg">
                            <i className="bi bi-plus-circle me-2"></i>Post New Job
                        </Button>
                    </Link>
                </Col>
            </Row>

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <StatsCard
                        icon="briefcase"
                        number={stats.totalJobs}
                        label="Total Jobs Posted"
                        color="primary"
                    />
                </Col>
                <Col md={4} className="mb-3">
                    <StatsCard
                        icon="people"
                        number={stats.totalApplicants}
                        label="Total Applicants"
                        color="secondary"
                    />
                </Col>
                <Col md={4} className="mb-3">
                    <StatsCard
                        icon="star"
                        number={stats.shortlisted}
                        label="Shortlisted Candidates"
                        color="success"
                    />
                </Col>
            </Row>

            {/* Recent Jobs */}
            <Card className="custom-card">
                <Card.Body>
                    <h5 className="mb-4">Your Posted Jobs</h5>
                    {jobs.length > 0 ? (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Posted On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.slice(0, 5).map(job => (
                                    <tr key={job._id}>
                                        <td><strong>{job.title}</strong></td>
                                        <td>{job.location}</td>
                                        <td>{job.jobType}</td>
                                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/employer/job/${job._id}/applicants`)}
                                            >
                                                View Applicants
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-briefcase" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3">No Jobs Posted Yet</h5>
                            <p className="text-muted">Start by posting your first job</p>
                            <Link to="/employer/post-job">
                                <Button variant="primary">Post a Job</Button>
                            </Link>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default EmployerDashboard;
