const nodemailer = require("nodemailer")
const nodemailerConfig = require("./nodemailerConfig")

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailerConfig
    return transporter.sendMail({
        from: `"Anastasiia" ${process.env.EMAIL_USER}`, // sender address
        to,
        subject,
        html,
    })
}

// const sendEmail = async ({ to, subject, html }) => {

//     await fetch("https://api.brevo.com/v3/smtp/email", {
//         method: "POST",
//         headers: {
//             accept: "application/json",
//             "api-key": process.env.BREVO_API_KEY,
//             "content-type": "application/json",
//         },
//         body: JSON.stringify({
//             sender: {
//                 name: "Anastasiia",
//                 email: process.env.SENDER_EMAIL,
//             },
//             to: [{ email: to }],
//             subject: subject,
//             htmlContent: html,
//         }),
//     })
// }

module.exports = sendEmail
