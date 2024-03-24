// RabbitMQ queue for managing messages between producer and consumer
const amqp = require('amqplib');
const { UPDATE_COUNTER_QUEUE, NOTIFY_COUNTER_QUEUE, ENABLE_MESSAGE_FAILURES } = require("../constants");

let channel;
let connection;

const initMessagingQueue = async () => {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(UPDATE_COUNTER_QUEUE);
  await channel.assertQueue(NOTIFY_COUNTER_QUEUE);
};

const closeChannel = async () => {
  await channel.close();
  await connection.close();
};

const sendMessage = async (queue, value) => {
  const message = Buffer.from(JSON.stringify(value));
  const sent = channel.sendToQueue(queue, message);
  return sent;
};

const onMessageReceived = (queue, consumerFunc) => {
  channel.consume(queue, (msg) => {
    const value = JSON.parse(msg.content.toString());
    try {
      if (ENABLE_MESSAGE_FAILURES && Math.random() < 0.5) {
        throw new Error("Artificial error for testing");
      }

      consumerFunc(value);
      channel.ack(msg);
    } catch (e) {
      console.log(`Consumer error, retrying ${value} : `, e.toString());
      channel.nack(msg, false, true); // resend teh message back into queue for reprocessing
    }
  });
};

module.exports = { initMessagingQueue, sendMessage, onMessageReceived, closeChannel };