const sendEmail = require("./sendEmail")

const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin,
}) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p>Please verify your email by clicking the following link: <a href="${verifyEmail}">Verify Email</a></p>`

    await sendEmail({
        to: email,
        subject: "Email Confirmation",
        html: `<h3>Hello, ${name}!</h3>
        ${message}`,
    })
}

module.exports = sendVerificationEmail
