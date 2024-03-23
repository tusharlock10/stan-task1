const redis = require('redis')

const key = 'counter'

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

const setupRedis = async () => {
  await redisClient.connect();
};

const updateCounter = async () => {
  const counter = await redisClient.get(key);
  console.log("Counter : ", counter)
  await redisClient.set(key, Number(counter) + 1);
};

const resetCounter = async () => {
  await redisClient.set(key, 0);
};


const readCounter = async () => {
  return await redisClient.get(key);
};


module.exports = {
  setupRedis,
  updateCounter,
  resetCounter,
  readCounter
}