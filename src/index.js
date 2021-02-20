const app = require('./app')
const port = process.env.PORT

// turn the surver on yeah!
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
