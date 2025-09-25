const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM } = require('./config');

let cachedTransporter = null;

async function createTransporter() {
    if (cachedTransporter) return cachedTransporter;

    // If credentials are missing, fall back to Ethereal for testing
    if (!SMTP_USER || !SMTP_PASS) {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        cachedTransporter = transporter;
        return transporter;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    cachedTransporter = transporter;
    return transporter;
}

async function sendMail({ to, subject, html, text }) {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject,
        text,
        html
    });

    // If using Ethereal, log preview URL to help testing
    if (nodemailer.getTestMessageUrl && info) {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) {
            console.log('Preview email at:', url);
        }
    }
    return info;
}

module.exports = { sendMail };


