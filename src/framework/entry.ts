import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { Producer } from "../core/interface/kafka/Producer";
import { Consumer } from "../core/interface/kafka/Consumer";
import { Logger } from "../core/interface/Logger/winston";
import { transaction } from "../core/interface/proto/build/transaction";
import Transaction = transaction.Transaction;
import { account } from "../core/interface/proto/build/account";
import Account = account.Account;
import { validation } from "../core/interface/proto/build/validation";
import ValidationResponse = validation.ValidationResponse;
import Status = validation.ValidationResponse.Status;
import { useCharactor } from "../core/interface/controller/charactor.controller";

const bootstrap = async () => {
  await createConnection();

  if (process.env.NODE_ENV === "development") {
    setInterval(() => {
      Producer()
        .setTopic("azuki.dp.action.test")
        .setMessage("Produce 전송 테스트")
        .send();
    }, 5000);

    Consumer().setGroupId("dp-test").setTopic("azuki.dp.action.test").receive();
  }

  if (process.env.NODE_ENV === "production") {
    // /azuki\.login\.action\..*/i
    // 캐릭터 생성 1단계 - 검증
    Consumer()
      .setGroupId("dp-action-validation")
      .setTopic("azuki.login.action.validation")
      .receive((message) => {
        const data: Transaction = Transaction.deserialize(message.value);
        console.log(`[ProtoBuf 검증]: ${data}`);

        useCharactor()
          .findByName(data.validationRequest.account.user_name)
          .then((res) => {
            const response: Transaction = new Transaction();
            response.validationResponse = new ValidationResponse();
            response.transaction_id = data.transaction_id;
            response.validationResponse.status =
              res === undefined ? Status.SUCCESS : Status.DUPLICATED;
            response.span_id = data.span_id;

            Producer()
              .setTopic("azuki.dp.action.validation")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          });
      });

    // 캐릭터 생성 1단계 - 생성
    Consumer()
      .setGroupId("dp-action-create")
      .setTopic("azuki.login.action.create")
      .receive((message) => {
        Producer()
          .setTopic("azuki.dp.action.create")
          .setMessage(() => {
            const data: Transaction = Transaction.deserialize(message.value);
            console.log(`[ProtoBuf 검증]: ${data}`);

            const response: Transaction = new Transaction();
            response.validationResponse = new ValidationResponse();
            response.transaction_id = data.transaction_id;
            response.span_id = data.span_id;
            response.validationResponse.status = Status.SUCCESS;

            useCharactor()
              .setCharactor({
                username: data.makeAccountRequest.account.user_name,
                password: data.makeAccountRequest.account.user_password,
                hair: data.makeAccountRequest.hair,
                face: data.makeAccountRequest.face,
                gender: data.makeAccountRequest.sex,
                guardian: data.makeAccountRequest.fortune,
                nationality: data.makeAccountRequest.nationality,
                isActive: Boolean(Number(data.makeAccountRequest.nxclub_id)),
              })
              .save();

            return response.serialize();
          })
          .send();
      });
  }
};

bootstrap();
