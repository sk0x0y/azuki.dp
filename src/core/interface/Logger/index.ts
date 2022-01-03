import { logLevel } from "kafkajs";
import winston from "winston";
import { Logger } from "./winston";

const toWinstonLogLevel = (level) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return "error";
    case logLevel.WARN:
      return "warn";
    case logLevel.INFO:
      return "info";
    case logLevel.DEBUG:
      return "debug";
  }
};

export const WinstonLogCreator = (logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });

  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    // logger.log({
    //   level: toWinstonLogLevel(level),
    //   message,
    //   extra,
    // });
    Logger()
      .setPrefix(
        `${
          process.env.NODE_ENV === "production"
            ? "[SYSTEM LOG] "
            : "[KAFKA LOG] "
        }`
      )
      .info(
        `${
          process.env.NODE_ENV === "production"
            ? (message === "Starting" && "Service Starting...") ||
              (message.includes("joined") && "Service Started!") ||
              "Service Error!"
            : message
        } / ${
          extra.duration !== undefined
            ? "Request Time " + extra.duration + "ms / "
            : ""
        }Respond At ${new Date(extra.timestamp).toLocaleTimeString()}`
      );
  };
};
