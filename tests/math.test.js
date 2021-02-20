//destructured import
const { calculateTip } = require('../src/math')
const { fahrenheitToCelsius } = require('../src/math')
const { celsiusToFahrenheit } = require('../src/math')
const { add } = require('../src/math')

test('Test tip function', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const total = fahrenheitToCelsius(32)
    expect(total).toBe(0)
})

test('Should convert 0 F to 32 C', () => {
    const total = celsiusToFahrenheit(0)
    expect(total).toBe(32)
})

// test('Async test demo', (done)=> {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
    
// })

// example testing async functions
test('test promise based async function', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

// alternative approach using async await - easier than above. less nesting, more readable
test('Should add two numbers async/await', async () => {
    const sum = await add(10,22)
    expect(sum).toBe(32)
})

