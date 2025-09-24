module.exports = {
    MONGO_USERNAME: process.env.MONGO_USERNAME || 'admin',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'admin',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'userdb',
    PORT: process.env.PORT || 1234,
    JWT_SECRET: process.env.JWT_SECRET|| '#^#%^#^^#%&',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_SECURE: String(process.env.SMTP_SECURE || 'false') === 'true',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    MAIL_FROM: process.env.MAIL_FROM || 'no-reply@example.com'
}