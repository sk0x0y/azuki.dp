import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "azuki-dp",
  brokers: ["192.168.0.100:9092"],
  connectionTimeout: 3000,
  // logLevel: logLevel.DEBUG,
});

export default kafka;
