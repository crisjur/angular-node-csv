import moment from "moment";
import winston from "winston";
import WinstonDailyRotate from "winston-daily-rotate-file";
import config from "@server/config";

const daily_rotate_transport = new WinstonDailyRotate({
  filename: "./logs/app",
  datePattern: "YYYY-MM/DD[.log]",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ message, level, timestamp }) => `${timestamp}/${(config.app && config.app.log_component) || "unknown"}/${level}: ${message}`),
  transports: [daily_rotate_transport]
});

if (!process.env.NODE_ENV)
  logger.add(new winston.transports.Console());

export default function (...args: any[]) {
  const timestamp = moment().format("YYYYMMDD HH:mm:ss.SSS");
  logger.info({ message: [...args].join(" "), timestamp });
};