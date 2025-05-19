const mongoose = require('mongoose')
const Users = require('../models/Users')

const notificationSchema = mongoose.Schema({
    notify_id: { type: Number, required: true, unique: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['ongoing', 'completed'] }
}, { timestamps: true })

const notifyModel = mongoose.model('CitizenNotification', notificationSchema)

module.exports = notifyModel