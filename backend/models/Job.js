const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [String],
    location: {
        type: String,
        required: true
    },
    salary: String,
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract']
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Hiring'],
        default: 'Open'
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
