const request = require('supertest')
const Task = require('../src/models/task')
const { userOneId, userOne, userTwo, userTwoId, setupDatabase, taskOne, taskTwo, taskThree } = require('./fixtures/db')
const app = require('../src/app')


// this clears all the user data before running tests
beforeEach(setupDatabase)

// Test create task for user
test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// test request all tasks for user one (expecting 2 results)
test('Should retrieve all tasks for userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(201)
    expect(response.body.length).toEqual(2)
})

// test to see if second user can delete task owned by first user
test('Can userTwo delete task owned by userOne', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})