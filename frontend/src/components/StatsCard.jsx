import { Card } from 'react-bootstrap';

function StatsCard({ icon, number, label, color = 'primary' }) {
    return (
        <Card className="stats-card h-100">
            <Card.Body>
                <div className="feature-icon">
                    <i className={`bi bi-${icon}`} style={{ color: `var(--${color}-color)` }}></i>
                </div>
                <div className="stats-number">{number}</div>
                <div className="stats-label">{label}</div>
            </Card.Body>
        </Card>
    );
}

export default StatsCard;
