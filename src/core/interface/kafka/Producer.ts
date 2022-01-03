import { Producer as ProducerType } from "kafkajs";
import { kafka } from "./index";
import { Logger } from "../Logger/winston";

class ProducerInstance {
  private producer: ProducerType;
  private topic;
  private message: Buffer;

  constructor() {
    this.producer = kafka.producer();
  }

  setTopic(topic) {
    this.topic = topic;

    return this;
  }

  setMessage(cb: () => any): ProducerInstance;
  setMessage(message: any): ProducerInstance;
  setMessage(arg): ProducerInstance {
    if (typeof arg !== "function") {
      this.message = Buffer.from(arg);
    }

    if (typeof arg === "function") {
      this.message = Buffer.from(arg());
    }

    return this;
  }

  private async connect() {
    await this.producer.connect().catch((err) => {
      Logger().setPrefix("[Kafka Producer Connection Error] ").error(err);
    });

    return this;
  }

  async send() {
    await this.connect();

    await this.producer
      .send({
        topic: this.topic,
        messages: [{ value: this.message }],
      })
      .catch((err) => {
        Logger().setPrefix("[Kafka Producer Error] ").error(err);
      });

    Logger()
      .setPrefix("[Producer] ")
      .info(`Topic: ${this.topic} / Send Message: ${this.message}`);
  }
}
export const Producer = () => {
  return new ProducerInstance();
};
