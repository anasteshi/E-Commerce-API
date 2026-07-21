const nodemailer = require("nodemailer")
const nodemailerConfig = require("./nodemailerConfig")

const sendEmail = async ({ to, subject, html }) => {
    let testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailerConfig
    return transporter.sendMail({
        from: '"Anastasiia" <nastya@gmail.com>', // sender address
        to,
        subject,
        html,
    })
}

module.exports = sendEmail
