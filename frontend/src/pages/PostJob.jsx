import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function PostJob() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        location: '',
        salary: '',
        jobType: 'Full-time'
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            await api.post('/jobs', {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            });

            setMessage('Job posted successfully!');
            setTimeout(() => {
                navigate('/employer/dashboard');
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="custom-card">
                        <Card.Body className="p-4">
                            <h2 className="mb-4">Post a New Job</h2>

                            {message && (
                                <Alert variant={message.includes('success') ? 'success' : 'danger'}>
                                    {message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Senior React Developer"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Job Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        name="description"
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Skills Required (comma separated)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="skills"
                                                placeholder="e.g. React, Node.js, MongoDB"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                placeholder="e.g. Mumbai, Remote"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Salary Range</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="salary"
                                                placeholder="e.g. ₹8-12 LPA"
                                                value={formData.salary}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Job Type</Form.Label>
                                            <Form.Select
                                                name="jobType"
                                                value={formData.jobType}
                                                onChange={handleChange}
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Contract">Contract</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Posting...' : 'Post Job'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/employer/dashboard')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PostJob;
