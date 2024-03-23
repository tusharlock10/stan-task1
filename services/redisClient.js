// using redis for storing the counter
const redis = require('redis');

const getRedisClient = async () => {
  const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
  await redisClient.connect();
  return redisClient;
};

module.exports = { getRedisClient };