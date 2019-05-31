import cors from 'cors';
import keys from './keys';
export const REDIS_SESSION_PF = 'ress:';
export const _refreshMaxAge = Math.floor(1000 * 60 * 60 * 24 * 2); // 2 days
export const _redisTTL = Math.floor(1000 * 60 * 5); // 5 min   
const _accessMaxAge = Math.floor(1000 * 60 * 15); // 15 min

const _isDev = process.env.NODE_ENV === 'development' ? true : false;

// NOTE every five mins we refer back to the 
// redis session expires, refering back to the refresh token
// renew redis session
const {
    DB_RESET,
    LISTENING_PORT,
    DOMAIN,
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT
} = keys;

const CORS:cors.CorsOptions = {
    origin: (origin, callback) => {
        // TODO PORTS are not in prod env or that should be more specific
        const re = `(http(s)?\\:\\/\\/)?\\b${DOMAIN}(:?\\d+(\\/)?)?`;
        const domain = new RegExp(re, 'g');
        if (origin && origin.match(domain)) {
            callback(null, true);
        } else {
            console.log('corsissue');
            callback(null);
        }
    },
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 600
};

const whitelist = ['http://localhost:4000', 'http://localhost:3000'];
const CORS_DEV:cors.CorsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            console.log('whitelisted');
            callback(null, true)
        } else {
            console.log(origin);
            console.log('rejected');
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    preflightContinue: false, // true = next() ... but this is the final handler on this srvr
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 600
};


namespace SETTINGS {
    export const isDev = _isDev;
    export const NBF_BUFFER = 500;

    // TODO TEST CHECK #TWO
    export const ENV_BASED_RESET = isDev ? DB_RESET : false;
    export const ENV_BASED_CORS = isDev ? CORS_DEV : CORS;
    export const PORT:number = LISTENING_PORT;

    export const nbf:(number) => number = (today) => Math.floor((today / 1000) + NBF_BUFFER);
    export const refreshMaxAge:(number?) => number = (today) => today ? Math.floor((today / 1000) + _refreshMaxAge) : _refreshMaxAge; // 2 days
    export const accessMaxAge:(number?) => number = (today) => today ? Math.floor((today /  1000) + _accessMaxAge) : _accessMaxAge; // 15 mins
    export const COOKIE_SETTINGS = Object.freeze({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        signed: true
    });

    export const REDIS_SETTINGS = {
        port: REDIS_PORT,
        host: REDIS_HOST,
        password: REDIS_PASSWORD,
        ttl: _redisTTL,
        prefix: REDIS_SESSION_PF
    };
}

export default SETTINGS;