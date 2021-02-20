const express = require('express')
require('./db/mongoose')// ensures that mongoose connects to the db
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// to get app working on heroku
const port = process.env.PORT

// Middleware function for maintenance mode
// app.use((req, res, next) => {
//     res.status(503).send('We will be back online soon!')
// })

// this parses inbound data
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// turn the surver on yeah!
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
