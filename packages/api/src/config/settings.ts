const _refreshMaxAge = Math.floor(1000 * 60 * 60 * 24 * 2); // 2 days
const _accessMaxAge = Math.floor(1000 * 60 * 15); // 15 min

export const nbfBuffer = 500;
export const isDev = (app) => app.get('env') === 'development' ? true : false;
export const CORS = {
    origin: (origin, callback) => {
        const re = `(http(s)?\\:\\/\\/)?\\b${process.env.ROOT_DOMAIN}(:?\\d+(\\/)?)?`;
        const domain = new RegExp(re, 'g');
        if (origin && origin.match(domain)) {
            callback(null, true);
        } else {
            console.log('corsissue');
            callback(500);
        }
    },
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    preflightContinue: true,
    optionsSuccessStatus: 200
};

export const nbf:(number) => number = (today) => Math.floor((today / 1000) + nbfBuffer);
export const refreshMaxAge:(number?) => number = (today) => today ? Math.floor((today / 1000) + _refreshMaxAge) : _refreshMaxAge; // 2 days
export const accessMaxAge:(number?) => number = (today) => today ? Math.floor((today /  1000) + _accessMaxAge) : _accessMaxAge; // 15 mins
export const COOKIE_SETTINGS = Object.freeze({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true
});