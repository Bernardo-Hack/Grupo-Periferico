import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_username,
    password: process.env.DB_password,
    database: process.env.DB_databasename,
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, "../entities/*.entity{.ts,.js}")],
    subscribers: [],
    migrations: [],
});