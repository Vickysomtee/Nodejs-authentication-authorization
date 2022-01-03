const redis = require("redis");

const redisClient = redis.createClient()

redisClient.on('connect', () => {
  console.log("Redis is Connected")
});

redisClient.on('error', (error) => {
  console.log(error)
})
module.exports = redisClient;