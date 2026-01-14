import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../utils/api';

function EmployerProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        companyName: '',
        companyDescription: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        companyDescription: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                companyName: response.data.companyName || '',
                companyDescription: response.data.companyDescription || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await api.put('/users/profile', formData);

            setMessage('Profile updated successfully!');
            fetchProfile();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Company Profile</h2>

            {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}

            <Row>
                <Col md={8}>
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="mb-4">Company Information</h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Your Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={user.email}
                                        disabled
                                    />
                                    <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Company Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="companyDescription"
                                        placeholder="Tell candidates about your company..."
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="mb-3">Profile Status</h5>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Name</span>
                                    <i className={`bi bi-check-circle${user.name ? '-fill text-success' : ''}`}></i>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Company Name</span>
                                    <i className={`bi bi-check-circle${user.companyName ? '-fill text-success' : ''}`}></i>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Description</span>
                                    <i className={`bi bi-check-circle${user.companyDescription ? '-fill text-success' : ''}`}></i>
                                </div>
                            </div>

                            <hr />

                            <p className="text-muted small mb-0">
                                Complete your company profile to attract the best talent
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EmployerProfile;
