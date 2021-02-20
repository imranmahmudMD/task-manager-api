const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()

// Test user - has an object ID created above, and a token that is created using jwt
const userOne = {
    _id: userOneId,
    name: "Imran Mahmuduserone",
    email: "imran+userone@mail.harvard.edu",
    password: '123456789',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

// this clears all the user data before running tests
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

// Test to signup a new user
test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Imran Mahmud',
        email: 'imran@mail.harvard.edu',
        password: '123456789'
    }).expect(201)
})

// Test to login existing user
test('Should log a user in', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

// test login failure due to non-existent user
test('Should fail to login a user that does not exist', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'incorrectpass'
    }).expect(400)
})

// Test should get profile for user. Set the authorosition info in the header taking token from userOne array
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// test fail getting profile when not authenticated
test('test should fail getting profile when not authenticated', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

// test should delete account for user
// test('Should delete account for user', async () => {
//     await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })

// // test should not delete account for user
// test('Should not delete account for unauthenticate user', async () => {
//     await request(app)
//         .delete('/users/me')
//         .send()
//         .expect(401)
// })