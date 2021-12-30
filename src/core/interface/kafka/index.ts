import { Kafka, logLevel } from "kafkajs";
import { WinstonLogCreator } from "../Logger";

export const kafka = new Kafka({
  clientId: "azuki-dp",
  brokers: ["192.168.0.100:9092"],
  connectionTimeout: 3000,
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator,
});
