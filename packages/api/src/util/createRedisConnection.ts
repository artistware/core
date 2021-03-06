import * as Redis from "ioredis";
import SETTINGS from './../config/settings';
const { REDIS_SETTINGS } = SETTINGS;
const { port, host, password } = REDIS_SETTINGS;

export const redis = new Redis({
    port,
    host,
    maxRetriesPerRequest: 100 // RUN REDIS LOCALLY... TODO warn if off
});