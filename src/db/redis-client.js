import { createClient } from "redis";
import config from "../config/index.js";

const redisClient = createClient({
  socket: {
    host: config.Redis.HOST,
    port: config.Redis.PORT,
  },
  password: config.Redis.PASSWORD,
});
redisClient.connect();

redisClient.on("connect", () => console.log("redisClient redis ulandi"));

redisClient.on("error", (err) => console.log("xatolik", err));

export default redisClient;
