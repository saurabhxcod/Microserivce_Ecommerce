const express = require('express');
const app = express();
const orderRoutes = require('./routes/orderRoutes');
const PORT = process.env.PORT || 1236;
const connectDB = require('./config/db');
const logger = require('./utils/logger');

connectDB();
const { consumeMessage } = require('./utils/rabbitMQ');

app.use(express.json());

app.use('/api/orders', orderRoutes);

consumeMessage("orderQueue", async (msg) => {
    logger.info("📩 Received order message:", msg);
    logger.info(`Sending notification to user ${msg.userId} for order ${msg.orderId}`);
});

app.listen(PORT, () => {
  logger.info(`Order service is running on port ${PORT}`);
});