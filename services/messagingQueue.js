// RabbitMQ queue for managing messages between producer and consumer
const amqp = require('amqplib');
const { QUEUE_NAME } = require("../constants");

let channel;

const initMessagingQueue = async () => {
  const conn = await amqp.connect("amqp://localhost");
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME);
};

const sendMessage = async (value) => {
  channel.sendToQueue(QUEUE_NAME, Buffer.from(value));
};

module.exports = { initMessagingQueue, sendMessage };