const Express = require('express')
const DeptModel = require('../models/Department')
const ProjectModel = require('../models/ProjectsWork')
const auth = require('../middleware/isAuth')

const ProjectRouter = Express.Router()

ProjectRouter.post('/create-project', auth, async (req, res) => {
    try {
        const { name, desc, startDate, status, endDate, departmentID, budget, progress } = req.body
        console.log(name, desc, startDate, endDate, status, departmentID, budget, progress)

        if (!name || !desc || !startDate || !endDate || !status || !departmentID || !budget || !progress) {
            return res.send({ success: false, message: 'Please provide all details!' })
        }

        const fetchDept = await DeptModel.findOne({ id: departmentID })
        if (!fetchDept) {
            return res.send({ success: false, message: 'Department not found! .' })
        }

        let Project = await ProjectModel.findOne({}).sort({ id: -1 })
        let id = Project ? Project.id + 1 : 1


        const newProject = new ProjectModel({
            id: id,
            name: name,
            description: desc,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status,
            departmentID: fetchDept._id,
            budget,
            progress
        })

        const saveProject = await newProject.save()

        if (saveProject) {
            return res.send({ success: true, message: "Project Created successfully!" })
        }
        else {
            return res.send({ success: false, message: "Failed to create Project!" })
        }
    }
    catch (err) {
        console.log("Error in Project:", err)
        return res.send({ success: false, message: 'Trouble in Project create! Please contact admin.' })
    }
})

ProjectRouter.get('/project', async (req, res) => {
    try {
        const project = await ProjectModel.find({}).populate('departmentID')

        if (!project) {
            return res.send({ success: false, message: "Project Can't get" })
        }

        return res.send({ success: true, project: project })

    }
    catch (err) {
        console.log("Error in Project Get:", err)
        return res.send({ success: false, message: 'Trouble in Project get! Please contact admin.' })
    }
})

ProjectRouter.get('/Project/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const particular_id = await ProjectModel.findOne({ id: id }).populate('departmentID')

            if (particular_id) {
                return res.send({ success: true, Project: particular_id })
            }
            else {
                return res.send({ success: false, message: "No Project found" })
            }
        }
        else {
            return res.send({ success: false, message: " Project  id not found" })
        }

    }
    catch (err) {
        console.log("Error in Project Get:", err)
        return res.send({ success: false, message: 'Trouble in Project get! Please contact admin.' })
    }
})

ProjectRouter.post('/upadte-project/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!id) {
            return res.send({ success: false, message: " project  id not found" })
        }

        const { progress, status, } = req.body;

        if (!progress || !status) {
            return res.send({ success: false, message: "progress and Status required" });
        }

        // Find the application                       
        const project = await ProjectModel.findOne({ id: id }).populate('departmentID');

        if (!project) {
            return res.send({ success: false, message: "project not found" });
        }

        // Update status and remarks
        const updateResult = await ProjectModel.updateOne(
            { id: id },
            { $set: { progress, status } }
        );
        if (updateResult.modifiedCount > 0) {

            return res.send({
                success: true,
                message: "Project Update Successfull"
            });

        }
        else {
            return res.send({
                success: false,
                message: "No changes were made to the project"
            });
        }

    } catch (err) {
        console.error("Error in update route:", err.stack || err);
        return res.send({
            success: false,
            message: "Failed to update project. Please contact admin."
        });
    }
})


ProjectRouter.post('/updateproject/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!id) {
            return res.send({ success: false, message: " project  id not found" })
        }

        const { name, desc, startDate, endDate, departmentID, budget } = req.body;

        if (!name || !desc || !startDate || !endDate || !departmentID || !budget) {
            return res.send({ success: false, message: "All fields are required" });
        }

        // Find the application                       
        const project = await ProjectModel.findOne({ id: id }).populate('departmentID');

        if (!project) {
            return res.send({ success: false, message: "project not found" });
        }


        const fetchDept = await DeptModel.findOne({ id: departmentID })
        if (!fetchDept) {
            return res.send({ success: false, message: 'Department not found! .' })
        }

        // Update status and remarks
        const updateResult = await ProjectModel.updateOne(
            { id: id },
            { $set: { name, description: desc, startDate: new Date(startDate), endDate: new Date(endDate), departmentID: fetchDept._id, budget } }
        );
        if (updateResult.modifiedCount > 0) {

            return res.send({
                success: true,
                message: "Project Update Successfull"
            });

        }
        else {
            return res.send({
                success: false,
                message: "No changes were made to the project"
            });
        }

    } catch (err) {
        console.error("Error in update route:", err.stack || err);
        return res.send({
            success: false,
            message: "Failed to update project. Please contact admin."
        });
    }
})

module.exports = ProjectRouter
