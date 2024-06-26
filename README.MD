# Assignment Task 1
The project demonstrates the following -
- Using Redis to store a counter value
- Using RabbitMQ FIFO queue to update counter
- Race condition by trying to update counter at the same time
- Prevention of race condition using a lock in redis
- Error handling by requeuing failed messages
- Notify and show new counter value when update is successful

## Installations required
1. Node.js
2. RabbitMQ
3. Redis

## Files explained
1. **config.env** used to set config to the app.
  - `ENABLE_REDIS_LOCK` when set to true, will lock the counter in redis to prevent race condition
  - `ENABLE_MESSAGE_FAILURES` when set to true, will produce artificial errors to demonstrate error handling, by resending the messages back to queue
  - `PROCESSES` set the number of process to spawn
2. **updateProducer.js** will set a counter in Redis to 0. Then it will spawn 2 (or more) processes in cluster mode that will send updates to counter value simultaneously in RabbitMQ.
3. **updateConsumer.js** will consume messages from queue and adds the values to the counter in Redis. If ENABLE_REDIS_LOCK is not enabled, it will not try to lock the counter value and try to update counter simultaneously, resulting in a race condition. Once counter is updated, it send a message in RabbitMQ to notify.
4. **readCounter.js** will consume all counter notification messages and display the current value of counter when it is notified

## Run
Run the files in separate terminals in the following order -
1. node readCounter.js
2. node updateConsumer.js
3. node updateProducer.js