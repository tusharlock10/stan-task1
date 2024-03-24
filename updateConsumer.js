const { initMessagingQueue, onMessageReceived } = require('./services/messagingQueue');
const { initRedisClient, getCounterValue, setCounterValue } = require('./services/redisClient');

const updateCounter = async (message) => {
  const counter = await getCounterValue();
  const updateValue = JSON.parse(message.content);
  const newValue = counter + updateValue;
  setCounterValue(newValue);

  console.log(`Updated counter ${counter} by ${updateValue} = ${newValue}`);
};

const main = async () => {
  await initMessagingQueue();
  await initRedisClient();

  console.log("Listening for counter updates ... ")
  onMessageReceived(updateCounter);
};

main();