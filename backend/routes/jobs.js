const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// Get all jobs with search and filters
router.get('/', async (req, res) => {
    try {
        const { search, skills, location, jobType } = req.query;

        let query = {};

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by skills
        if (skills) {
            query.skills = { $in: skills.split(',') };
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by job type
        if (jobType) {
            query.jobType = jobType;
        }

        const jobs = await Job.find(query).populate('employer', 'name companyName').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name companyName companyDescription');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create job (employers only)
router.post('/', protect, authorize('employer'), async (req, res) => {
    try {
        const { title, description, skills, location, salary, jobType } = req.body;

        const job = await Job.create({
            title,
            description,
            skills,
            location,
            salary,
            jobType,
            employer: req.user._id,
            companyName: req.user.companyName || 'Company'
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update job (employers only)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        job.title = req.body.title || job.title;
        job.description = req.body.description || job.description;
        job.skills = req.body.skills || job.skills;
        job.location = req.body.location || job.location;
        job.salary = req.body.salary || job.salary;
        job.jobType = req.body.jobType || job.jobType;
        job.status = req.body.status || job.status;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete job (employers and admin)
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job or is admin
        if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get employer's jobs
router.get('/my/jobs', protect, authorize('employer'), async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
