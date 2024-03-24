// RabbitMQ queue for managing messages between producer and consumer
const amqp = require('amqplib');
const { QUEUE_NAME } = require("../constants");

let channel;
let connection;

const initMessagingQueue = async () => {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
};

const closeChannel = async () => {
  await channel.close();
  await connection.close();
};

const sendMessage = async (value) => {
  const message = Buffer.from(JSON.stringify(value));
  const sent = channel.sendToQueue(QUEUE_NAME, message);
  return sent;
};

const onMessageReceived = (consumerFunc) => {
  channel.consume(QUEUE_NAME, (msg)=>{
    consumerFunc(msg)
    channel.ack(msg)
  });
};

module.exports = { initMessagingQueue, sendMessage, onMessageReceived, closeChannel };