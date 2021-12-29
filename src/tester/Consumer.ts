import kafka from "../core/interface/kafka";
import { register } from "../core/interface/controller/charactor.controller";
import { getConnection } from "typeorm";
import { CharactorRepository } from "../core/interface/repository/charactor.repository";

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

      // const connection = await getConnection();
      // const charactorRepository =
      //   connection.getCustomRepository(CharactorRepository);
      // const charactor = charactorRepository.create();
      // charactor.username = "user";
      // charactor.password = "pass";
      // await charactorRepository.save(charactor);
    },
  });
};
