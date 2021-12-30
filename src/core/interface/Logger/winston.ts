import winston from "winston";

class WinstonInstance {
  private logger: winston.Logger;
  private prefix: string;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
    this.prefix = "";
  }

  setPrefix(prefix) {
    this.prefix = prefix;

    return this;
  }

  info(message) {
    return this.logger.info(`${this.prefix}${message}`);
  }

  warn(message) {
    return this.logger.warn(`${this.prefix}${message}`);
  }

  error(message) {
    return this.logger.error(`${this.prefix}${message}`);
  }
}

export const Logger = () => {
  return new WinstonInstance();
};
