import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/my/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            await api.put(`/jobs/${jobId}`, { status: newStatus });
            fetchJobs(); // Refresh the list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'Open': 'warning',
            'Closed': 'danger',
            'Hiring': 'success'
        };
        return <Badge bg={variants[status] || 'warning'}>{status || 'Open'}</Badge>;
    };

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Posted Jobs</h2>
                <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
                    <i className="bi bi-plus-circle me-2"></i>Post New Job
                </Button>
            </div>

            <Card className="custom-card">
                <Card.Body>
                    {jobs.length > 0 ? (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Posted On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td>
                                            <strong>{job.title}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {job.skills?.slice(0, 3).join(', ')}
                                                {job.skills?.length > 3 && '...'}
                                            </small>
                                        </td>
                                        <td>{job.location}</td>
                                        <td>
                                            <Badge bg="primary">{job.jobType}</Badge>
                                        </td>
                                        <td>{job.salary || 'Not specified'}</td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant={job.status === 'Open' ? 'warning' : job.status === 'Hiring' ? 'success' : 'danger'}
                                                    size="sm"
                                                >
                                                    {job.status === 'Open' && '🟡 '}
                                                    {job.status === 'Hiring' && '🟢 '}
                                                    {job.status === 'Closed' && '🔴 '}
                                                    {job.status || 'Open'}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleStatusChange(job._id, 'Open')}>
                                                        🟡 Open
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleStatusChange(job._id, 'Hiring')}>
                                                        🟢 Hiring
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleStatusChange(job._id, 'Closed')}>
                                                        🔴 Closed
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/employer/job/${job._id}/applicants`)}
                                            >
                                                <i className="bi bi-people me-1"></i>Applicants
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/jobs/${job._id}`)}
                                            >
                                                <i className="bi bi-eye me-1"></i>View
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(job._id)}
                                            >
                                                <i className="bi bi-trash me-1"></i>Delete
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
                            <Button variant="primary" onClick={() => navigate('/employer/post-job')}>
                                Post a Job
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MyJobs;
