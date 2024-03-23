// RabbitMQ queue for managing messages between producer and consumer
const amqp = require('amqplib');
const { QUEUE_NAME } = require("../constants");

const getMQ = async () => {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  return channel;
};

module.exports = { getMQ };