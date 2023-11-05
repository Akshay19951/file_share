const nodemailer = require("nodemailer");

async function sendMail({from, to, subject, text, html}){
    return {
        from: `inShare <${from}>`,
        to,
        subject,
        text,
        html
    }
}

module.exports = sendMail;