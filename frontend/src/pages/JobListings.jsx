import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import JobCard from '../components/JobCard';
import api from '../utils/api';

function JobListings() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        skills: '',
        location: '',
        jobType: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, jobs]);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
            setFilteredJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const applyFilters = () => {
        let filtered = jobs;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Skills filter
        if (filters.skills) {
            filtered = filtered.filter(job =>
                job.skills?.some(skill =>
                    skill.toLowerCase().includes(filters.skills.toLowerCase())
                )
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Job type filter
        if (filters.jobType) {
            filtered = filtered.filter(job => job.jobType === filters.jobType);
        }

        setFilteredJobs(filtered);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Browse Jobs</h2>

            <Row>
                {/* Sidebar Filters */}
                <Col md={3}>
                    <div className="filter-sidebar sticky-top" style={{ top: '20px' }}>
                        <h5 className="filter-title">Filters</h5>

                        <Form.Group className="mb-3">
                            <Form.Label>Skills</Form.Label>
                            <Form.Control
                                type="text"
                                name="skills"
                                placeholder="e.g. React, Node.js"
                                value={filters.skills}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="e.g. Mumbai, Remote"
                                value={filters.location}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Job Type</Form.Label>
                            <Form.Select
                                name="jobType"
                                value={filters.jobType}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={() => {
                                setFilters({ skills: '', location: '', jobType: '' });
                                setSearchTerm('');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </Col>

                {/* Job Listings */}
                <Col md={9}>
                    {/* Search Bar */}
                    <Card className="custom-card mb-4">
                        <Card.Body>
                            <Form.Control
                                type="text"
                                size="lg"
                                placeholder="Search jobs by title, company, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Card.Body>
                    </Card>

                    {/* Results Count */}
                    <p className="text-muted mb-3">
                        Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                    </p>

                    {/* Job Cards Grid */}
                    <Row>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <Col md={6} key={job._id} className="mb-3">
                                    <JobCard job={job} />
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <Card className="custom-card text-center py-5">
                                    <Card.Body>
                                        <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                        <h5 className="mt-3">No jobs found</h5>
                                        <p className="text-muted">Try adjusting your filters or search terms</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default JobListings;
