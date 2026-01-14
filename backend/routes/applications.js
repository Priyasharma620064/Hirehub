const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// Apply to a job (job seekers only)
router.post('/', protect, authorize('seeker'), async (req, res) => {
    try {
        const { jobId } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            applicant: req.user._id
        });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's applications (job seekers)
router.get('/my-applications', protect, authorize('seeker'), async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate('job')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get applicants for a job (employers only)
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email skills education resumeUrl')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update application status (employers only)
router.put('/:id/status', protect, authorize('employer'), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        application.status = req.body.status;
        await application.save();

        res.json({ message: 'Application status updated', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
