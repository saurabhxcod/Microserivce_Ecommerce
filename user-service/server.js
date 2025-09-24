const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const {PORT} = require('./utils/config');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const {connectRabbitMQ, consumeMessage} = require('./utils/rabbitMQ');

connectDB();

app.use(express.json());

const { sendMail } = require('./utils/mailer');

async function notifyUser(message) {
  console.log("User service received order:", message);
  if (message.type === 'ORDER_RESULT') {
    const subject = message.status === 'SUCCESS' ? 'Your order was placed successfully' : 'Your order failed';
    const text = message.status === 'SUCCESS'
      ? `Order ${message.orderId} placed successfully. Total: ${message.totalAmount}`
      : `Order failed. Reason: ${message.reason || 'Unknown error'}`;
    const html = message.status === 'SUCCESS'
      ? `<p>Order <strong>${message.orderId}</strong> placed successfully.</p><p>Total: <strong>${message.totalAmount}</strong></p>`
      : `<p>Order failed.</p><p>Reason: ${message.reason || 'Unknown error'}</p>`;
    if (message.userEmail) {
      try {
        await sendMail({ to: message.userEmail, subject, text, html });
        console.log('Confirmation email sent to', message.userEmail);
      } catch (err) {
        console.error('Error sending confirmation email:', err.message);
      }
    } else {
      console.warn('No userEmail provided on message; skipping email');
    }
  }
}

app.use('/api/auth', authRoutes);


(async () => {
  await connectRabbitMQ();
  consumeMessage('userQueue', notifyUser);
})();

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});