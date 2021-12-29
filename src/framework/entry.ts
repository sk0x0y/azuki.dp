import "reflect-metadata";
import "dotenv/config";
import { run as ConsumerRun } from "../tester/Consumer";
import createConnection from "../core/interface/typeorm";

const bootstrap = async () => {
  await createConnection();
  await ConsumerRun();
};

bootstrap();
