const express = require('express')
const Notify_model = require('../models/Notification')
const SignUp_models = require('../models/Users')

const auth = require('../middleware/isAuth')

const NotifyRouter = express.Router()

// create Notification
NotifyRouter.post('/create-notification', auth, async (req, res) => {
    try {

        const { citizenId, title, msg } = req.body
        console.log(msg, title, citizenId)

        const lastnotify = await Notify_model.findOne({}).sort({ notify_id: -1 })
        const id = lastnotify ? lastnotify.notify_id + 1 : 1

        if (!msg || !title || !citizenId) {
            return res.send({ success: false, message: "All fields are required" })
        }

        const citizen = await SignUp_models.findOne({ id: id, role: 'citizen' })
        if (!citizen) {
            return res.send({ success: false, message: "Invalid citizen email" })
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
        console.log("Error in Notification:", err)
        return res.send({ success: false, message: 'Trouble in Notification create! Please contact admin.' })
    }
})

NotifyRouter.get('/notification', auth, async (req, res) => {
    try {
        const notify = Notify_model.find({}).populate('citizen')

        if (!notify) {
            return res.send({ success: false, message: "Notification Can't get" })
        }

        return res.send({ success: true, message })

    }
    catch (err) {
        console.log("Error in Notification Get:", err)
        return res.send({ success: false, message: 'Trouble in Notification get! Please contact admin.' })
    }
})

NotifyRouter.get('/notification/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const particular_id = await Notify_model.findOne({ notify_id: id }).populate('citizen')

            if (particular_id) {
                return res.send({ success: true, notification: particular_id })
            }
            else {
                return res.send({ success: false, message: "No Notification found" })
            }
        }
        else {
            return res.send({ success: false, message: " Notification  id not found" })
        }

    }
    catch (err) {
        console.log("Error in Notification Get:", err)
        return res.send({ success: false, message: 'Trouble in Notification get! Please contact admin.' })
    }
})

NotifyRouter.post('/upadte-notification/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!id) {
            return res.send({ success: false, message: " Notification  id not found" })
        }

        const { status } = req.body;

        if (!status) {
            return res.send({ success: false, message: "Status  required" });
        }

        // Find the application
        const notification = await Notify_model.findOne({ notify_id: id }).populate('citizen');
        if (!notification) {
            return res.send({ success: false, message: "Notification not found" });
        }

        // Update status and remarks
        const updateResult = await Notify_model.updateOne(
            { notify_id: id },
            { $set: { status } }
        );
        if (updateResult.modifiedCount > 0) {

            return res.send({
                success: true,
                message: "Notification Update Successfull"
            });

        }

    } catch (err) {
        console.error("Error in update route:", err.stack || err);
        return res.send({
            success: false,
            message: "Failed to update notification. Please contact admin."
        });
    }
})
module.exports = NotifyRouter