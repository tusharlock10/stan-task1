// redis methods for storing and updating the counter
const redis = require('redis');
const { COUNTER_KEY, QUEUE_NAME, ENABLE_REDIS_LOCK } = require('../constants');

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

const lockCounter = async () => {
  // implements a lock on the counter value, returns isLocked if lock is acquired
  // uses the atomic nature of incr command to acquire lock
  // if the lockValue is not equal to 1, means there is another process that has acquired the lock

  if (!ENABLE_REDIS_LOCK) return true;

  const lockValue = await redisClient.incr(`LOCK:${QUEUE_NAME}`);
  return lockValue == 1;
};

const unlockCounter = async () => {
  // removes the lock from counter
  if (ENABLE_REDIS_LOCK) await redisClient.del(`LOCK:${QUEUE_NAME}`);
};

module.exports = { initRedisClient, getCounterValue, setCounterValue, lockCounter, unlockCounter };