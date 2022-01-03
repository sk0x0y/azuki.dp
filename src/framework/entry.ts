import "reflect-metadata";
import "dotenv/config";
import { createConnection, getConnection, getCustomRepository } from "typeorm";
import { Producer } from "../core/interface/kafka/Producer";
import { Consumer } from "../core/interface/kafka/Consumer";
import { Logger } from "../core/interface/Logger/winston";
import { transaction } from "../core/interface/proto/build/transaction";
import { response } from "../core/interface/proto/build/response";
import { CharactorRepository } from "../core/interface/repository/charactor.repository";
import Transaction = transaction.Transaction;
import Response = response.Response;
import Status = response.Response.Status;

const bootstrap = async () => {
  createConnection()
    .then(() => {
      Logger().setPrefix("[데이터베이스] ").warn("연결 성공!");
    })
    .catch((err) => {
      Logger().setPrefix("[데이터베이스 에러] ").error(err);
    });

  // process.on("SIGINT", () => {
  //   Producer().disconnect();
  //   Consumer().disconnect();
  // });
  // process.on("SIGTERM", () => {
  //   Producer().disconnect();
  //   Consumer().disconnect();
  // });

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
    Logger().warn(
      "[운영 모드] - 이 모드에서는 코드 변경 시 핫 리로드가 지원되지 않습니다. 이 경우, 수동으로 재시작 해주세요."
    );
    // /azuki\.login\.action\..*/i
    // 캐릭터 생성 1단계 - 검증
    Consumer()
      .setGroupId("dp-action-validation")
      .setTopic("azuki.login.action.validation")
      .receive((message) => {
        const data: Transaction = Transaction.deserialize(message.value);
        Logger().warn(`[캐릭터 검증 시작]: ${data}`);

        const response: Transaction = new Transaction();

        response.response = new Response();
        response.transaction_id = data.transaction_id;
        response.span_id = data.span_id;

        if (!getConnection().isConnected) {
          // Logger().setPrefix("[검증 체크포인트]").error("");
          Producer()
            .setTopic("azuki.dp.action.validation")
            .setMessage(() => {
              response.response.status = Status.DB_ERROR;
              return response.serialize();
            })
            .send();

          createConnection()
            .then(() => {
              Logger().setPrefix("[데이터베이스] ").warn("연결 성공!");
            })
            .catch((err) => {
              Logger().setPrefix("[데이터베이스 에러] ").error(err);
            });

          Logger().setPrefix("[검증 체크포인트]").error("디비꺼쪗다고보냄");
          return;
        }

        const charactorRepository = getCustomRepository(CharactorRepository);
        charactorRepository
          .findOne({ username: data.validationRequest.account.user_name })
          .then((res) => {
            response.response.status =
              res === undefined || null ? Status.SUCCESS : Status.DUPLICATED;
            response.response.status === Status.SUCCESS
              ? Logger().warn("[캐릭터 검증 성공 - 신규 캐릭터]")
              : Logger().error("[캐릭터 검증 실패 - 중복 캐릭터]");

            Producer()
              .setTopic("azuki.dp.action.validation")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          })
          .catch((err) => {
            Logger().error(`[캐릭터 검증 에러]: ${err}`);
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
        const data: Transaction = Transaction.deserialize(message.value);
        Logger().warn(`[캐릭터 생성 시작]: ${data}`);

        const charactorRepository = getCustomRepository(CharactorRepository);
        const charactor = charactorRepository.create();
        charactor.username = data.makeAccountRequest.account.user_name;
        charactor.password = data.makeAccountRequest.account.user_password;
        charactor.hair = data.makeAccountRequest.hair;
        charactor.face = data.makeAccountRequest.face;
        charactor.gender = data.makeAccountRequest.sex;
        charactor.guardian = data.makeAccountRequest.fortune;
        charactor.nationality = data.makeAccountRequest.nationality;
        charactor.nxclub_id = data.makeAccountRequest.nxclub_id;

        const response: Transaction = new Transaction();
        response.response = new Response();
        response.transaction_id = data.transaction_id;
        response.span_id = data.span_id;

        charactorRepository
          .save(charactor)
          .then((res) => {
            Logger().setPrefix("[캐릭터 생성 성공] ").warn(res.username);
            response.response.status = Status.SUCCESS;

            Producer()
              .setTopic("azuki.dp.action.create")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          })
          .catch((err) => {
            Logger().setPrefix("[캐릭터 생성 실패] ").error(err);
            response.response.status = Status.DB_ERROR;

            Producer()
              .setTopic("azuki.dp.action.create")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          });
      });

    // 캐릭터 로그인
    Consumer()
      .setGroupId("dp-action-login")
      .setTopic("azuki.login.action.login")
      .receive((message) => {
        const data: Transaction = Transaction.deserialize(message.value);
        const response: Transaction = new Transaction();
        response.response = new Response();
        response.transaction_id = data.transaction_id;
        response.span_id = data.span_id;

        if (!getConnection().isConnected) {
          Logger()
            .setPrefix("[데이터베이스 연결 시도] ")
            .error(
              "커넥션이 끊긴 상태에서 접속을 시도하여 데이터베이스 연결을 다시 시도합니다"
            );

          Producer()
            .setTopic("azuki.dp.action.login")
            .setMessage(() => {
              response.response.status = Status.DB_ERROR;
              Logger()
                .setPrefix("[로그인 체크포인트 1] ")
                .error("디비꺼쪗다고보냄");
              return response.serialize();
            })
            .send();

          createConnection()
            .then(() => {
              Logger().setPrefix("[데이터베이스] ").warn("연결 성공!");
            })
            .catch((err) => {
              Logger().setPrefix("[데이터베이스 에러] ").error(err);
            });

          Logger()
            .setPrefix("[로그인 체크포인트 2] ")
            .error("디비꺼쪗다고보냄");
          return;
        }

        Logger()
          .setPrefix("[캐릭터 로그인 시도] ")
          .warn(
            `${data.validationRequest.account.user_name} ${data.validationRequest.account.user_password}`
          );

        const charactorRepository = getCustomRepository(CharactorRepository);
        charactorRepository
          .findOne({
            username: data.validationRequest.account.user_name,
            // password: data.validationRequest.account.user_password,
          })
          .then((res) => {
            if (res !== undefined) {
              Logger().setPrefix("[캐릭터 로그인 성공] ").warn(res.username);
              response.response.status = Status.SUCCESS;

              if (res.blocked) {
                Logger().setPrefix("[캐릭터 로그인 차단] ").warn(res.username);
                response.response.status = Status.BLOCK;
              }

              if (
                res.password !== data.validationRequest.account.user_password
              ) {
                Logger()
                  .setPrefix("[캐릭터 로그인] ")
                  .warn(`잘못 된 비밀번호: ${res.username}`);
                response.response.status = Status.WRONG_PASSWORD;
              }
            }
            if (res === undefined) {
              Logger()
                .setPrefix("[캐릭터 로그인] ")
                .warn(
                  `존재하지 않는 캐릭터: ${data.validationRequest.account.user_name}`
                );

              response.response.status = Status.NOT_EXISTS;
            }

            Producer()
              .setTopic("azuki.dp.action.login")
              .setMessage(() => {
                Logger().warn("로그인 보내지나 테스트");
                return response.serialize();
              })
              .send();
          })
          .catch((err) => {
            Logger().setPrefix("[캐릭터 로그인 실패] ").error(err);
            response.response.status = Status.UNKNOWN_ERROR;

            Producer()
              .setTopic("azuki.dp.action.login")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          });
      });

    // 맵서버 메타데이터
    Consumer()
      .setGroupId("dp-action-login-metadata")
      .setTopic("azuki.map.action.login.metadata")
      .receive((message) => {
        const data: Transaction = Transaction.deserialize(message.value);
        const response: Transaction = new Transaction();
        response.response = new Response();
        response.transaction_id = data.transaction_id;
        response.span_id = data.span_id;

        const charactorRepository = getCustomRepository(CharactorRepository);
        charactorRepository
          .findOne({
            username: data.validationRequest.account.user_name,
          })
          .then((res) => {
            // TODO: Proto 에 캐릭터 정보 담아야 함
            Logger().setPrefix("[캐릭터 로그인 메타데이터 로드] ").warn(res);
            response.response.status = Status.SUCCESS;

            Producer()
              .setTopic("azuki.dp.action.login.metadata")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          })
          .catch((err) => {
            Logger()
              .setPrefix("[캐릭터 로그인 메타데이터 로드 실패] ")
              .error(err);
            // response.response.status = Status.UNKNOWN_ERROR;

            Producer()
              .setTopic("azuki.dp.action.login.metadata")
              .setMessage(() => {
                return response.serialize();
              })
              .send();
          });
      });
  }
};

bootstrap();
