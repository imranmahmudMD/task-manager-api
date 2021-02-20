const mongoose = require('mongoose')

// the task-manager-api is the db name -> it's different to the one in mongodb.js and is included as an argument here
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

