// script for producing updates for the counter
// assuming that producer is some service running somewhere different from consumer 
// should be run after consumer.js

const cluster = require('cluster');
const { initRedisClient, setCounterValue } = require('./services/redisClient');
const { initMessagingQueue, sendMessage } = require('./services/messagingQueue');

const main = async () => {
  const processes = 2; // number of processes to create

  await initMessagingQueue();
  await initRedisClient();

  if (cluster.isMaster) {
    // 1. reset the counter to 0 before making any updates
    // 2. create separate processes for updating the counter

    await setCounterValue(0);
    for (let i = 0; i < processes; i++) {
      cluster.fork();
    }
  } else {
    // worker process
    // send message to update the counter value from 1-10
    const updateValue = Math.floor(Math.random() * 10) + 1;
    sendMessage(updateValue);
    console.log("Sent message to update counter by : ", updateValue);
  }
};

main();