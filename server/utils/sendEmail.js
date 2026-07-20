const nodemailer = require("nodemailer")
const nodemailerConfig = require("./nodemailerConfig")

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(nodemailerConfig)
    try {
        await transporter.sendMail({
            from: '"Anastasiia" <nastya@gmail.com>', // sender address
            to,
            subject,
            html,
        })
    } catch (err) {
        console.error("Error while sending mail:", err)
    }
}

module.exports = sendEmail
