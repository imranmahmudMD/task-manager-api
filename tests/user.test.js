const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

// Test to signup a new user
test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Imran Mahmud',
        email: process.env.TEST_EMAIL,
        password: '123456789'
    }).expect(201)

    // assert that db changed correctly and user is not null
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about response body
    expect(response.body).toMatchObject({
        user: {
            name: 'Imran Mahmud',
            email: process.env.TEST_EMAIL,
        },
        token: user.tokens[0].token
    })
    // ensure password not stored in plain text
    expect(user.password).not.toBe('123456789')
})

// Test to login existing user
test('Should log a user in', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    // fetch user from DB, check token in response matches 2nd token on user
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
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
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// test should not delete account for user
test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

// test Should upload avatar image
test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')// how you upload file in text
        .expect(200)
    // check file uploaded
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))// tests if the object stored as avatar is a buffer
})

// Should update valid user fields
test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Updated name'
        }).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Updated name')
})

// Should not update invalid user fields
test('Should not update invalid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'new address'
        }).expect(400)
})