const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.skills = req.body.skills || user.skills;
            user.education = req.body.education || user.education;
            user.companyName = req.body.companyName || user.companyName;
            user.companyDescription = req.body.companyDescription || user.companyDescription;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                skills: updatedUser.skills,
                education: updatedUser.education,
                companyName: updatedUser.companyName,
                companyDescription: updatedUser.companyDescription
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload resume (job seekers only)
router.post('/resume', protect, authorize('seeker'), upload.single('resume'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.resumeUrl = req.file.path;
            await user.save();
            res.json({ message: 'Resume uploaded successfully', resumeUrl: req.file.path });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users (admin only)
router.get('/all', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Block/unblock user (admin only)
router.put('/:id/block', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isBlocked = !user.isBlocked;
            await user.save();
            res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
