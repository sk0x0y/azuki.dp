import kafka from "../core/interface/kafka";

const producer = kafka.producer();

export const run = async () => {
  await producer.connect();

  await setInterval(() => {
    const date = new Date().toLocaleTimeString();
    producer
      .send({
        topic: "test-topic",
        messages: [{ value: `Hello KafkaJS user! ${Math.random()} ${date}` }],
      })
      .then((res) => {
        console.log(`[Producer] ${date}`);
      });
  }, 50);
};
