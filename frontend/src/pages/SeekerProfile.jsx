import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../utils/api';

function SeekerProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        skills: [],
        education: '',
        resumeUrl: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        skills: '',
        education: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
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
                skills: response.data.skills?.join(', ') || '',
                education: response.data.education || ''
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
            await api.put('/users/profile', {
                name: formData.name,
                skills: formData.skills.split(',').map(s => s.trim()),
                education: formData.education
            });

            setMessage('Profile updated successfully!');
            fetchProfile();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        setMessage('');
        setLoading(true);

        const formDataFile = new FormData();
        formDataFile.append('resume', resumeFile);

        try {
            await api.post('/users/resume', formDataFile, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage('Resume uploaded successfully!');
            fetchProfile();
            setResumeFile(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">My Profile</h2>

            {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}

            <Row>
                <Col md={8}>
                    {/* Profile Information */}
                    <Card className="custom-card mb-4">
                        <Card.Body>
                            <h5 className="mb-4">Profile Information</h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
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
                                    <Form.Label>Skills (comma separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="skills"
                                        placeholder="e.g. JavaScript, React, Node.js"
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Education</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="education"
                                        placeholder="e.g. B.Tech in Computer Science"
                                        value={formData.education}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Resume Upload */}
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="mb-4">Resume</h5>

                            {user.resumeUrl && (
                                <div className="mb-3">
                                    <p className="text-success">
                                        <i className="bi bi-check-circle me-2"></i>
                                        Resume uploaded
                                    </p>
                                    <a
                                        href={user.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        <i className="bi bi-download me-2"></i>View Current Resume
                                    </a>
                                </div>
                            )}

                            <Form onSubmit={handleResumeUpload}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload New Resume (PDF)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                    />
                                </Form.Group>

                                <Button
                                    variant="success"
                                    type="submit"
                                    disabled={!resumeFile || loading}
                                >
                                    {loading ? 'Uploading...' : 'Upload Resume'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="custom-card">
                        <Card.Body>
                            <h5 className="mb-3">Profile Completion</h5>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Name</span>
                                    <i className={`bi bi-check-circle${user.name ? '-fill text-success' : ''}`}></i>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Skills</span>
                                    <i className={`bi bi-check-circle${user.skills?.length > 0 ? '-fill text-success' : ''}`}></i>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Education</span>
                                    <i className={`bi bi-check-circle${user.education ? '-fill text-success' : ''}`}></i>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Resume</span>
                                    <i className={`bi bi-check-circle${user.resumeUrl ? '-fill text-success' : ''}`}></i>
                                </div>
                            </div>

                            <hr />

                            <p className="text-muted small mb-0">
                                Complete your profile to increase your chances of getting hired
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SeekerProfile;
