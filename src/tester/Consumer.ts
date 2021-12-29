import kafka from "../core/interface/kafka";

const consumer = kafka.consumer({ groupId: "test-group" });

export const run = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: /azuki\.login\.action\..*/i,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[Consumer Message]: ${topic} ${partition} ${message.value}`);
    },
  });
};
