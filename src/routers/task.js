const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// create a task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,//copies all properties from request over to the object
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)//status must preceed the error!
    }       
})

// GET all tasks /tasks?completed=true
// GET /tasks?limit=10&skip=0 (note that parseInt turns the number which is a STRING into a number)
// GET /tasks?sortBy=createdAt_asc (1) or desc (-1)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        // ternary operator - desc = -1 if true, 1 if false
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        // 2 ways to specify only tasks for our user. below is 1st option:
        // const tasks = await Task.find({ owner: req.user._id })
        //2nd option:
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})


// get one task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, owner: req.user._id })
        if(!task) {
                return res.status(404).send()
            }
        res.send(task)
    } catch(e) {
        res.status(404).send()
    }
})

//update a task, identify task based on ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update attempted' })
    }

    try{
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
    
    if(!task) {
        return res.status(404).send()
    }
    
    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    res.send(task)
} catch (e) {
    res.status(400).send(e)
}
})

// delete a task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = router