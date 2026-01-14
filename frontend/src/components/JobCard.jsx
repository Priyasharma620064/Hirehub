import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function JobCard({ job }) {
    const navigate = useNavigate();

    const getStatusClass = (status) => {
        const classes = {
            'Open': 'job-status-open',
            'Closed': 'job-status-closed',
            'Hiring': 'job-status-hiring'
        };
        return classes[status] || 'job-status-open';
    };

    return (
        <Card
            className="job-card"
            onClick={() => navigate(`/jobs/${job._id}`)}
        >
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="job-title mb-0">{job.title}</h5>
                    <span className={`job-status-badge ${getStatusClass(job.status || 'Open')}`}>
                        {job.status || 'Open'}
                    </span>
                </div>

                <p className="company-name">{job.companyName}</p>

                <div className="job-meta">
                    <span><i className="bi bi-geo-alt"></i> {job.location}</span>
                    {job.salary && <span><i className="bi bi-cash"></i> {job.salary}</span>}
                    <span><i className="bi bi-briefcase"></i> {job.jobType}</span>
                </div>

                <div className="mb-3">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1" style={{ fontSize: '0.75rem' }}>
                            {skill}
                        </Badge>
                    ))}
                    {job.skills?.length > 3 && (
                        <Badge bg="light" text="dark" style={{ fontSize: '0.75rem' }}>
                            +{job.skills.length - 3} more
                        </Badge>
                    )}
                </div>

                <p className="text-muted small mb-0">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
            </Card.Body>
        </Card>
    );
}

export default JobCard;
