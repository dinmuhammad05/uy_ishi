import winston from "winston";
import "winston-mongodb";
import config from "../../config/index.js";

// Toshkent vaqti qo‘shish
const customTime = winston.format((info) => {
  const date = new Date();
  info.timestamp = date.toLocaleString("en-GB", {
    timeZone: "Asia/Tashkent",
    hour12: false,
  });
  return info;
});

// Faqat "info" loglarni o‘tkazadigan filter
const infoOnly = winston.format((info) => {
  return info.level === "info" ? info : false;
});

const logger = winston.createLogger({
  transports: [
    // Faqat error loglar
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Har qanday log
    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    // Faqat info loglar
    new winston.transports.File({
      filename: "logs/success.log",
      level: "info", // bu bo'lishi kerak
      format: winston.format.combine(
        infoOnly(),      // faqat info darajadagi loglar
        customTime(),
        winston.format.json()
      ),
    }),

    // MongoDB error loglar uchun
    new winston.transports.MongoDB({
      db: config.MONGO_URI,
      collection: "errorLogs",
      level: "error",
    }),
  ],
  format: winston.format.combine(
    customTime(),
    winston.format.json()
  ),
});

export default logger;
