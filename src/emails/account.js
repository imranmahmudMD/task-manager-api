const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Welcome email: backticks needed to apply variables. 
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'imran@mail.harvard.edu',
        subject: 'Welcome to the task app!',
        text: `Welcome to the app, ${name}. Let me know how you get along and if you are finding it useful?`
    })
}


// Cancellation email: backticks needed to apply variables. 
const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'imran@mail.harvard.edu',
        subject: 'We are sorry to see you go..',
        text: `Hi ${name}. I'm really sorry that you have decided to cancel. If there is anything we can do to change your mind, just reply to this email. We would also like to know how we can improve our service for future customers... any advice you can share would be appreciated`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}