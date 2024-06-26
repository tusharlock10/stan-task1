// script for producing updates for the counter
// assuming that producer is some service running somewhere different from consumer 
// should be run after updateConsumer.js

const cluster = require('cluster');
const process = require('process');
const { PROCESSES, UPDATE_COUNTER_QUEUE } = require('./constants');
const { initRedisClient, setCounterValue } = require('./services/redisClient');
const { initMessagingQueue, sendMessage, closeChannel } = require('./services/messagingQueue');

const main = async () => {
  await initMessagingQueue();
  await initRedisClient();

  if (cluster.isMaster) {
    // 1. reset the counter to 0 before making any updates
    // 2. create separate processes for updating the counter

    await setCounterValue(0);

    console.log(`Spawning ${PROCESSES} processes`);
    for (let i = 0; i < PROCESSES; i++) {
      cluster.fork();
    }

    let workersFinished = 0;
    cluster.on('exit', () => {
      workersFinished++;
      if (workersFinished === PROCESSES) process.exit(0);
    });
  } else {
    // worker process
    // send message to update the counter value from 1-10
    const updateValue = Math.floor(Math.random() * 10) + 1;
    const sent = sendMessage(UPDATE_COUNTER_QUEUE, updateValue);
    if (sent) {
      console.log("Sent message to update counter by : ", updateValue);
    } else {
      console.log("Unable to send message to the queue");
    }

    await closeChannel();
    process.exit();
  }
};

main();

