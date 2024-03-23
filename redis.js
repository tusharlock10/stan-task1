import redis from 'redis';

const key = 'counter'

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

export const setupRedis = async () => {
  await redisClient.connect();
};

export const updateCounter = async () => {
  const counter = await redisClient.get(key);
  await redisClient.set(key, counter + 1);
};

export const resetCounter = async () => {
  await redisClient.set(key, 0);
};