const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "willie.renner@ethereal.email",
        pass: "uREgJutZR9aBtt56bR",
    },
})

module.exports = transporter