const { setTimeout } = require('node:timers/promises');
const { initRedisClient, getCounterValue, setCounterValue, lockCounter, unlockCounter } = require('./services/redisClient');
const { initMessagingQueue, onMessageReceived } = require('./services/messagingQueue');

const updateCounter = async (message) => {
  while (true) {
    // check for lock on the counter
    const isLocked = await lockCounter();
    if (!isLocked) {
      // if lock is not acquired, retry after 50 ms
      await setTimeout(50);
    } else {
      break;
    }
  }

  const counter = await getCounterValue();
  const updateValue = JSON.parse(message.content);
  const newValue = counter + updateValue;

  // set the new counter value and unlock the counter
  await setCounterValue(newValue);
  await unlockCounter();

  console.log(`Updated counter ${counter} by ${updateValue} = ${newValue}`);
};

const main = async () => {
  await initMessagingQueue();
  await initRedisClient();
  await unlockCounter();

  console.log("Listening for counter updates ... ");
  onMessageReceived(updateCounter);
};

main();