import { kafka } from "../core/interface/kafka";

import { CharactorController } from "../core/interface/controller/charactor.controller";
import { validation } from "../core/interface/proto/build/validation";
import { transaction } from "../core/interface/proto/build/transaction";
import Transaction = transaction.Transaction;
import ValidationResponse = validation.ValidationResponse;
import Status = validation.ValidationResponse.Status;

const consumer = kafka.consumer({ groupId: "test-group" });
const producer = kafka.producer();

export const run = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topic: /azuki\.login\.action\..*/i,
    // fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `[Consumer Message] - ${new Date()}: ${topic} ${partition} ${
          message.value
        }`
      );

      const data: Transaction = Transaction.deserialize(message.value);
      console.log(`[ProtoBuf 검증]: ${data}`);

      const charactorController = new CharactorController();
      charactorController
        .findByName(data.validationRequest.account.user_name)
        .then((res) => {
          const response: Transaction = new Transaction();
          response.validationResponse = new ValidationResponse();
          response.transaction_id = data.transaction_id;
          response.validationResponse.status =
            res === undefined ? Status.SUCCESS : Status.DUPLICATED;

          /*
             charactorController
      .setCharactor({
        username: data.account.user_name,
        password: data.account.user_password,
      })
      .save();
   */

          producer
            .send({
              topic: "azuki.dp.action.validation",
              messages: [
                {
                  value: Buffer.from(response.serialize()),
                },
              ],
            })
            .then((res) => {
              console.log(`[Producer] ${res}`);
            });
        })
        .catch((err) => {});
    },
  });
};
