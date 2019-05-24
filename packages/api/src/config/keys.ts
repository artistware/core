export default Object.freeze({
    DOMAIN: process.env.DOMAIN,
    ISSUER: [process.env.DOMAIN],
    AUDIENCE: [process.env.DOMAIN],
    KEYS: process.env.COOKIE_SECRET
});

// TODO ISSUER and AUDIENCE will have more logic in the future