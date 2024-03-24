const { NOTIFY_COUNTER_QUEUE } = require('./constants');
const { initRedisClient, getCounterValue } = require('./services/redisClient');
const { initMessagingQueue, onMessageReceived, purgeQueue } = require('./services/messagingQueue');


const readCounter = async () => {
  const counter = await getCounterValue();
  console.log("Current value of counter is : ", counter);
};

const main = async () => {
  await initMessagingQueue();
  await initRedisClient();
  await purgeQueue(NOTIFY_COUNTER_QUEUE);

  console.log("Reading counter updates ... ");
  onMessageReceived(NOTIFY_COUNTER_QUEUE, readCounter);
};

main();