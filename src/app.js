const express = require('express')
require('./db/mongoose')// ensures that mongoose connects to the db
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// this parses inbound data
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app