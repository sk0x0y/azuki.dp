import { Consumer as ConsumerType, KafkaMessage } from "kafkajs";
import { kafka } from "./index";
import { Logger } from "../Logger/winston";

class ConsumerInstance {
  private consumer: ConsumerType;
  private groupId: string;
  private topic: string;
  private message: KafkaMessage;

  setGroupId(groupId) {
    this.groupId = groupId;

    return this;
  }

  setTopic(topic) {
    this.topic = topic;

    return this;
  }

  private async connect() {
    this.consumer = kafka.consumer({ groupId: this.groupId });
    await this.consumer.connect().catch((err) => {
      Logger().setPrefix("[Kafka Consumer Connection Error] ").error(err);
    });

    return this;
  }

  private async subscribe(fromBeginning?) {
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning,
    });

    return this;
  }

  async receive(cb?: (message: KafkaMessage) => void) {
    await this.connect();
    await this.subscribe();

    await this.consumer
      .run({
        eachMessage: async ({ topic, partition, message }) => {
          Logger()
            .setPrefix("[Consumer] ")
            .info(`Topic: ${topic} / Receive Message: ${message.value}`);

          this.message = message;

          await cb(this.message);
        },
      })
      .catch((err) => {
        Logger().setPrefix("[Kafka Consumer Error] ").error(err);
      });
  }
}
export const Consumer = () => {
  return new ConsumerInstance();
};
