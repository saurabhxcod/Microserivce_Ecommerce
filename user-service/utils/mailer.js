const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM } = require('./config');

let cachedTransporter = null;

function createTransporter() {
    if (cachedTransporter) return cachedTransporter;
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });
    cachedTransporter = transporter;
    return transporter;
}

async function sendMail({ to, subject, html, text }) {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject,
        text,
        html
    });
    return info;
}

module.exports = { sendMail };


