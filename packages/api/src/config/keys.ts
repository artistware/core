let keys = {
    DOMAIN: process.env.ROOT_DOMAIN,
    ISSUER: [process.env.ROOT_DOMAIN],
    AUDIENCE: [process.env.ROOT_DOMAIN],
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    DB_RESET: false,
    LISTENING_PORT: typeof Number(process.env.PORT) === 'number' ? Number(process.env.PORT) : 3000,
    REDIS_PORT: typeof Number(process.env.REDIS_PORT) === 'number' ? Number(process.env.REDIS_PORT) : 6379,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_DB: process.env.REDIS_DB,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET
};

// TODO write test
// ..."true"
if (process.env.NODE_ENV === 'development') {
    keys.DB_RESET = process.env.DB_RESET === "true" ? true : false;
}

export default Object.freeze(keys);

// TODO ISSUER and AUDIENCE will have more logic in the future