const Express = require('express')
const DeptModels = require('../models/Department')
const isAuth = require('../middleware/isAuth')

const DeptRouters = Express.Router()

DeptRouters.post('/create-dept', isAuth, async (req, res) => {
    try {
        const { name, desc } = req.body
        console.log(name, desc)

        if (!name || !desc) {
            return res.send({ success: false, message: 'Please provide all details!' })
        }

        const fetchDept = await DeptModels.findOne({ deptname: name })
        if (fetchDept) {
            return res.send({ success: false, message: 'Department already exist! .' })
        }

        let Dept = await DeptModels.findOne({}).sort({ id: -1 })
        let deptId = Dept ? Dept.id + 1 : 1


        const newDept = new DeptModels({
            id: deptId,
            deptname: name,
            desc: desc
        })

        const savedept = await newDept.save()

        if (savedept) {
            return res.send({ success: true, message: "Department Created successfully!" })
        }
        else {
            return res.send({ success: false, message: "Failed to create Department!" })
        }
    }
    catch (err) {
        console.log("Error in Department:", err)
        return res.send({ success: false, message: 'Trouble in Department create! Please contact admin.' })
    }
})


DeptRouters.get('/dept', async (req, res) => {
    try {

        const allDept = await DeptModels.find({})

        if (allDept) {
            return res.send({ success: true, dept: allDept })
        }
        else {
            return res.send({ success: false, message: " Department not found" })
        }

    }
    catch (err) {
        console.log("Error in Department Retrieve:", err)
        return res.send({ success: false, message: 'Trouble in Department View! Please contact support Team.' })
    }

})


DeptRouters.get('/dept/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (id) {
            const partiDept = await DeptModels.findOne({ id: id })

            if (partiDept) {
                return res.send({ success: true, dept: partiDept })
            }
            else {
                return res.send({ success: false, message: "No Department found" })
            }
        }
        else {
            return res.send({ success: false, message: " Department id not found" })
        }
    }
    catch (err) {
        console.log("Error in Department Retrieve:", err)
        return res.send({ success: false, message: 'Trouble in Department View! Please contact support Team.' })
    }
})

DeptRouters.delete('/delete-dept/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!id) {

            return res.send({ success: false, message: "Department id not found" })
        }

        const delete_parti_dept = await DeptModels.deleteOne({ id: id })
        if (delete_parti_dept.deletedCount > 0) {
            return res.send({ success: true, message: ` Delete Department successfully ` })
        }
        else {
            return res.send({ success: false, message: "Not Deleted" })
        }
    }
    catch (err) {
        console.log("Error in Department Delete:", err)
        return res.send({ success: false, message: 'Trouble in Department Delete! Please contact support Team.' })
    }
})

DeptRouters.post('/update-dept/:id', isAuth, async (req, res) => {
    try {
        const id = Number(req.params.id)

        const { name, desc } = req.body

        if (!name || !desc) {
            return res.send({ success: false, message: "All fields are required" })
        }
        if (!id) {
            return res.send({ success: false, message: " Department id not found" })
        }
        const update_dept = await DeptModels.updateOne({ id: id }, {
            $set: {
                deptname: name,
                desc: desc
            }
        })

        if (update_dept.modifiedCount > 0) {
            return res.send({ success: true, message: "Update Product  successfull", dept: update_dept })
        }
        else {
            return res.send({ success: false, message: "Not Update" })
        }
    }
    catch (err) {
        console.log("Error in Department Update:", err)
        return res.send({ success: false, message: 'Trouble in Department Update! Please contact support Team.' })
    }
})

module.exports = DeptRouters