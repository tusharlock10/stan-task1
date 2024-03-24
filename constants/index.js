require('dotenv').config({ path: 'config.env' });
const process = require('process');

const QUEUE_NAME = "UPDATE_COUNTER";
const COUNTER_KEY = "counter";
const ENABLE_REDIS_LOCK = !!process.env['ENABLE_REDIS_LOCK'];
const PROCESSES = parseInt(process.env['PROCESSES']);

module.exports = {
  QUEUE_NAME, COUNTER_KEY, ENABLE_REDIS_LOCK, PROCESSES
};