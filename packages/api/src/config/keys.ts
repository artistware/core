let keys = {
    DOMAIN: process.env.ROOT_DOMAIN,
    ISSUER: [process.env.ROOT_DOMAIN],
    AUDIENCE: [process.env.ROOT_DOMAIN],
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    DB_RESET: false,
    PORT: process.env.PORT
};

// TODO write test
// ..."true"
if (process.env.NODE_ENV === 'development') {
    keys.DB_RESET = process.env.DB_RESET === "true" ? true : false;
}

export default Object.freeze(keys);

// TODO ISSUER and AUDIENCE will have more logic in the future