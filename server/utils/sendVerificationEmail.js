const sendEmail = require("./sendEmail")

const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin,
}) => {
    const message = `<p>Please click the following link to verify your email.</p>`
    await sendEmail({
        to: email,
        subject: "Email Confirmation",
        html: `<h3>Hello, ${name}!</h3>
        ${message}`,
    })
}

module.exports = sendVerificationEmail