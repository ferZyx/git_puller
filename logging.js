import "dotenv/config";
import "winston-mongodb"
import winston from "winston"
import {MongoClient} from "mongodb";

const log = winston.createLogger({
    level: 'debug',
    transports: [
        // write errors to console too
        new winston.transports.Console({format: winston.format.simple(), level:'debug'}),
    ],
});

const url = process.env.DB_URI;

const client = new MongoClient(url);
await client.connect();

const transportOptions = {
    db: await Promise.resolve(client),
    collection: 'logs',
    format:winston.format.metadata()
};

log.add(new winston.transports.MongoDB(transportOptions));


export default log
