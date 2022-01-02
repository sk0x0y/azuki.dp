export default {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true, // process.env.NODE_ENV === "development" ? true : false,
  logging: false,
  entities: ["src/core/application/entities/**/*.ts"],
  migrations: ["src/core/application/migrations/**/*.ts"],
  subscribers: ["src/core/application/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/core/application/entities",
    migrationsDir: "src/core/application/migrations",
    subscribersDir: "src/core/application/subscriber",
  },
};
