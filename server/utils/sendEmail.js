const nodemailer = require("nodemailer")

const sendEmail = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "willie.renner@ethereal.email",
            pass: "uREgJutZR9aBtt56bR",
        },
    })

    try {
        const info = await transporter.sendMail({
            from: '"Anastasiia" <nastya@gmail.com>', // sender address
            to: "user@user.com", // list of recipients
            subject: "Testing", // subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // HTML body
        })
    } catch (err) {
        console.error("Error while sending mail:", err)
    }
}

module.exports = sendEmail
