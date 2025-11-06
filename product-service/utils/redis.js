const Redis = require("ioredis");
const logger = require('./logger');
let client;

function setupRedis() {
    if (!client) {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        client = new Redis(url, {
            lazyConnect: true,
            maxRetriesPerRequest: 3,         // Add retry limit
            retryStrategy: (times) => {      // Add retry strategy
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableReadyCheck: true,
            connectTimeout: 10000,           
        });

        client.on("connect", () => logger.info("Redis connected successfully"));
        client.on("error", (err) => logger.error("Redis connection error:", err));
        client.on("close", () => logger.info("Redis connection closed"));
        client.on("reconnecting", () => logger.info("Redis reconnecting..."));

        // Initial connection
        client.connect().catch(err => {
            logger.error("Redis initial connection failed:", err.message);
            throw err; 
        });
    }
    return client;
}

module.exports = setupRedis;