require('dotenv').config({ path: 'config.env' });
const process = require('process');

const UPDATE_COUNTER_QUEUE = "UPDATE_COUNTER";
const NOTIFY_COUNTER_QUEUE = "NOTIFY_COUNTER";
const COUNTER_KEY = "counter";

const ENABLE_REDIS_LOCK = process.env['ENABLE_REDIS_LOCK']=="true";
const ENABLE_MESSAGE_FAILURES = process.env['ENABLE_MESSAGE_FAILURES']=="true";
const PROCESSES = parseInt(process.env['PROCESSES']);

module.exports = {
  UPDATE_COUNTER_QUEUE,
  NOTIFY_COUNTER_QUEUE,
  COUNTER_KEY,
  ENABLE_REDIS_LOCK,
  ENABLE_MESSAGE_FAILURES,
  PROCESSES,
};