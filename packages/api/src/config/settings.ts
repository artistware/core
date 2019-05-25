import cors from 'cors';
import keys from './keys';
const _isDev = process.env.NODE_ENV === 'development' ? true : false;
const _refreshMaxAge = Math.floor(1000 * 60 * 60 * 24 * 2); // 2 days
const _accessMaxAge = Math.floor(1000 * 60 * 15); // 15 min
const { DB_RESET, LISTENING_PORT, DOMAIN } = keys;

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
    preflightContinue: true,
    optionsSuccessStatus: 200
};

const CORS_DEV:cors.CorsOptions = {
    origin: _isDev ? true : false,
    methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    preflightContinue: true,
    optionsSuccessStatus: 200
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
}

export default SETTINGS;