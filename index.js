import cluster from 'cluster';
import { setupRedis, updateCounter, resetCounter } from './redis';

const processes = 3;

const main = async () => {
  if (cluster.isMaster) {
    await setupRedis();
    await resetCounter();

    // create processes to update the counter
    for (let i = 0; i < processes; i++) {
      cluster.fork();
    }
  } else {
    await updateCounter();
  }
};

main();