const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    deptname: { type: String, enum: ['Public Works Department', 'Highways Department', 'Rural Development', 'Urban Development'], required: true },
    desc: { type: String, required: true }
}, { timestamps: true })

const departmentModels = mongoose.model('Departments', departmentSchema)

module.exports = departmentModels