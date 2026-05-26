import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL as string,{
  maxRetriesPerRequest: 1,
  connectTimeout: 5000,
});

redis.on("connect",() => console.log("Redis connected"));
redis.on("error",(err:Error) => console.error("Redis error", err));

export default redis;