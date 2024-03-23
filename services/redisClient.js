// redis methods for storing and updating the counter
const redis = require('redis');
const { COUNTER_KEY } = require('../constants');

const redisClient = redis.createClient({ url: 'redis://localhost:6379' });

const initRedisClient = async () => {
  await redisClient.connect();
};

const getCounterValue = async () => {
  const value = await redisClient.get(COUNTER_KEY);
  return JSON.parse(value);
};

const setCounterValue = async (value) => {
  await redisClient.set(COUNTER_KEY, JSON.stringify(value));
};

module.exports = { initRedisClient, getCounterValue, setCounterValue };