const { setTimeout } = require('node:timers/promises');
const { NOTIFY_COUNTER_QUEUE, UPDATE_COUNTER_QUEUE } = require('./constants');
const { initRedisClient, getCounterValue, setCounterValue, lockCounter, unlockCounter } = require('./services/redisClient');
const { initMessagingQueue, onMessageReceived, sendMessage } = require('./services/messagingQueue');

const acquireCounterLock = async () => {
  let isLocked = false;
  while (!isLocked) {
    // try to lock the counter
    isLocked = await lockCounter();
    // if not locked, retry after 50 ms
    if (!isLocked) await setTimeout(50);
  }
};

const updateCounter = async (value) => {
  // wait for lock to be acquired
  await acquireCounterLock();

  const counter = await getCounterValue();
  const newValue = counter + value;

  // set the new counter value
  // notify about the updated counter value
  // unlock the counter
  await setCounterValue(newValue);
  await sendMessage(NOTIFY_COUNTER_QUEUE, newValue);
  await unlockCounter();

  console.log(`Updated counter ${counter} by ${value} = ${newValue}`);
};

const main = async () => {
  await initMessagingQueue();
  await initRedisClient();
  await unlockCounter();

  console.log("Listening for counter updates ... ");
  onMessageReceived(UPDATE_COUNTER_QUEUE, updateCounter);
};

main();