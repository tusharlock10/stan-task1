const cluster = require('cluster');
const { setupRedis, updateCounter, resetCounter, readCounter } = require('./redis');

const processes = 3;

const main = async () => {
  await setupRedis();

  if (cluster.isMaster) {
    console.log("Master process created");
    await resetCounter();

    // create processes to update the counter
    for (let i = 0; i < processes; i++) {
      cluster.fork();
    }

    // after a cluster have finished running, check the value of the counter
    cluster.on('exit', async () => {
      const value  = await readCounter();
      console.log(`COUNTER VALUE IS : ${value}`)
    });
  } else {
    console.log("In slave process")
    await updateCounter();
  }
};

main();