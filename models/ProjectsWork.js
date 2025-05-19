const mongoose = require('mongoose')
const DeptModel = require('../models/Department')

const projectSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["ongoing", "completed"] ,required: true },
    departmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments' },
    budget: { type: Number, required: true },
    progress: { type: Number, required: true },

}, { timestamps: true })

const ProjectModel = mongoose.model('ProjectWork', projectSchema)

module.exports = ProjectModel