import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Badge } from 'react-bootstrap';
import StatsCard from '../components/StatsCard';
import api from '../utils/api';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        seekers: 0,
        employers: 0,
        totalJobs: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchJobs();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/all');
            setUsers(response.data);
            setStats(prev => ({
                ...prev,
                totalUsers: response.data.length,
                seekers: response.data.filter(u => u.role === 'seeker').length,
                employers: response.data.filter(u => u.role === 'employer').length
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
            setStats(prev => ({
                ...prev,
                totalJobs: response.data.length
            }));
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            await api.put(`/users/${userId}/block`);
            fetchUsers();
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="people"
                        number={stats.totalUsers}
                        label="Total Users"
                        color="primary"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="person"
                        number={stats.seekers}
                        label="Job Seekers"
                        color="secondary"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="building"
                        number={stats.employers}
                        label="Employers"
                        color="success"
                    />
                </Col>
                <Col md={3} className="mb-3">
                    <StatsCard
                        icon="briefcase"
                        number={stats.totalJobs}
                        label="Total Jobs"
                        color="warning"
                    />
                </Col>
            </Row>

            {/* Tabs */}
            <Card className="custom-card">
                <Card.Body>
                    <Tabs defaultActiveKey="users" className="mb-4">
                        {/* Users Tab */}
                        <Tab eventKey="users" title="Users">
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td><strong>{user.name}</strong></td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg={
                                                    user.role === 'admin' ? 'danger' :
                                                        user.role === 'employer' ? 'primary' : 'secondary'
                                                }>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={user.isBlocked ? 'danger' : 'success'}>
                                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                                </Badge>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <Button
                                                            variant={user.isBlocked ? 'success' : 'warning'}
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleBlockUser(user._id)}
                                                        >
                                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>

                        {/* Jobs Tab */}
                        <Tab eventKey="jobs" title="Jobs">
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Posted On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job._id}>
                                            <td><strong>{job.title}</strong></td>
                                            <td>{job.companyName}</td>
                                            <td>{job.location}</td>
                                            <td>{job.jobType}</td>
                                            <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteJob(job._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Tab>

                        {/* Reports Tab */}
                        <Tab eventKey="reports" title="Reports">
                            <div className="py-4">
                                <h5 className="mb-4">Platform Statistics</h5>
                                <Row>
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h6>User Distribution</h6>
                                                <p className="mb-1">Job Seekers: {stats.seekers} ({((stats.seekers / stats.totalUsers) * 100).toFixed(1)}%)</p>
                                                <p className="mb-0">Employers: {stats.employers} ({((stats.employers / stats.totalUsers) * 100).toFixed(1)}%)</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h6>Job Statistics</h6>
                                                <p className="mb-1">Total Jobs Posted: {stats.totalJobs}</p>
                                                <p className="mb-0">Average per Employer: {stats.employers > 0 ? (stats.totalJobs / stats.employers).toFixed(1) : 0}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminDashboard;
