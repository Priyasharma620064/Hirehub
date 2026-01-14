import { useState, useEffect } from 'react';
import { Container, Table, Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
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
            <h2 className="mb-4">My Applications</h2>

            <Card className="custom-card">
                <Card.Body>
                    {applications.length > 0 ? (
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Applied Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr
                                            key={app._id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/jobs/${app.job._id}`)}
                                        >
                                            <td>
                                                <strong>{app.job?.title}</strong>
                                            </td>
                                            <td>{app.job?.companyName}</td>
                                            <td>
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {app.job?.location}
                                            </td>
                                            <td>{getStatusBadge(app.status)}</td>
                                            <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            <h5 className="mt-3">No Applications Yet</h5>
                            <p className="text-muted">Start applying to jobs to see them here</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Summary Stats */}
            {applications.length > 0 && (
                <Card className="custom-card mt-4">
                    <Card.Body>
                        <h5 className="mb-3">Application Summary</h5>
                        <div className="d-flex gap-4">
                            <div>
                                <strong>Total:</strong> {applications.length}
                            </div>
                            <div>
                                <strong>Applied:</strong> {applications.filter(a => a.status === 'Applied').length}
                            </div>
                            <div>
                                <strong>Shortlisted:</strong> {applications.filter(a => a.status === 'Shortlisted').length}
                            </div>
                            <div>
                                <strong>Rejected:</strong> {applications.filter(a => a.status === 'Rejected').length}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default MyApplications;
