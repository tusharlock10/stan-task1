const { initRedisClient, getCounterValue } = require('./services/redisClient');

const main = async ()=>{
  await initRedisClient()
  const counter = await getCounterValue()

  console.log("Counter value is : ", counter);
  process.exit()
}

main()