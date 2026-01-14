import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Form, Badge } from 'react-bootstrap';
import api from '../utils/api';

function Applicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetchJobDetails();
        fetchApplicants();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchApplicants = async () => {
        try {
            const response = await api.get(`/applications/job/${jobId}`);
            setApplicants(response.data);
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    };

    const updateStatus = async (applicationId, newStatus) => {
        try {
            await api.put(`/applications/${applicationId}/status`, { status: newStatus });
            fetchApplicants(); // Refresh the list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'Applied': 'info',
            'Shortlisted': 'success',
            'Rejected': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    return (
        <Container className="my-4">
            <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/employer/dashboard')}>
                <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </Button>

            {job && (
                <Card className="custom-card mb-4">
                    <Card.Body>
                        <h3>{job.title}</h3>
                        <p className="text-muted mb-0">
                            <i className="bi bi-geo-alt me-2"></i>{job.location} •
                            <i className="bi bi-briefcase ms-2 me-2"></i>{job.jobType}
                        </p>
                    </Card.Body>
                </Card>
            )}

            <Card className="custom-card">
                <Card.Body>
                    <h5 className="mb-4">
                        Applicants ({applicants.length})
                    </h5>

                    {applicants.length > 0 ? (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Skills</th>
                                    <th>Education</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map(app => (
                                    <tr key={app._id}>
                                        <td><strong>{app.applicant?.name}</strong></td>
                                        <td>{app.applicant?.email}</td>
                                        <td>
                                            {app.applicant?.skills?.slice(0, 2).join(', ')}
                                            {app.applicant?.skills?.length > 2 && '...'}
                                        </td>
                                        <td>{app.applicant?.education || 'N/A'}</td>
                                        <td>
                                            {app.applicant?.resumeUrl ? (
                                                <a
                                                    href={app.applicant.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-download me-1"></i>Download
                                                </a>
                                            ) : (
                                                <span className="text-muted">No resume</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(app.status)}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={app.status}
                                                onChange={(e) => updateStatus(app._id, e.target.value)}
                                                style={{ width: '150px' }}
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Shortlisted">Shortlisted</option>
                                                <option value="Rejected">Rejected</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-people" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3">No Applicants Yet</h5>
                            <p className="text-muted">Applications will appear here once candidates apply</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Applicants;
