const express = require('express')
const Notify_model = require('../models/Notification')
const SignUp_models = require('../models/Users')

const auth = require('../middleware/Auth')

NotifyRouter = express.Router()

// create Notification
NotifyRouter.post('/create-notification', auth, async (req, res) => {
    try {

        const { citizenId, title, msg } = req.body
        console.log(msg, title, citizenId)

        const lastnotify = await Notify_model.findOne().sort({ notify_id: -1 })
        const id = lastnotify ? lastnotify.notify_id + 1 : 1

        if (!msg || !type || !citizenId) {
            return res.send({ success: false, message: "All fields are required" })
        }

        const citizen = await SignUp_models.findOne({ id: id })
        if (!sender) {
            return res.send({ success: false, message: "Invalid sender email" })
        }


        const new_notify = new Notify_model({
            notify_id: id,
            title,
            message: msg,
            citizen: citizen._id,

        })
        const save_notify = await new_notify.save()

        if (save_notify || saves.length > 0) {
            return res.send({ success: true, message: " Notification Sent" })
        }
        else {
            return res.send({ success: false, message: " Something went wrong" })
        }
    }
    catch (err) {
        console.log("Error ", err)
        return res.send({ success: false, message: "Error" })
    }
})