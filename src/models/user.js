const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// create middleware Schema using mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password cannot contain the word "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual field is not actually stored in the db - it  helps mongoose determine relations
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// this method enables us to turn the user response into an object and remove some fields we dont want to expose
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    // items to remove from user object
    delete userObject.password
    delete userObject.avatar
    delete userObject.tokens
    return userObject
}

// methods on the instance user (not User)
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// function for logging in - check if you can find the user by email, and if so check if password matches that in DB
// don't give too much info away in error messages
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to log in')
    } 
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to log in')
    }
    return user
}

// hash the password before saving (check if password being modified, and if so then hash it)
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// delete tasks belonging to a user when a user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User