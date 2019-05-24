import * as jwt from 'jsonwebtoken';
import { 
    refreshMaxAge,
    accessMaxAge,
    COOKIE_SETTINGS,
    nbf,
    nbfBuffer
} from './../config/settings';
import keys from './../config/keys';

// TS TODO
export default function createTokens({ id, count, roles }) {
    const dateTime = new Date().getTime();

    // VERIFY
    // algorithm?: string;
    // keyid?: string; // TODO/NOTE allows for a series of keys
    // /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
    // expiresIn?: string | number;
    // /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
    // notBefore?: string | number;
    // audience?: string | string[]; // TODO session? // tenant or parent
    // subject?: string; // TODO session? // ID
    // issuer?: string; // TODO session? // tenant or parent
    // jwtid?: string; // TODO session?
    // noTimestamp?: boolean;
    // header?: object;
    // encoding?: string;

    const refreshPayload = {
        iat: dateTime,
        exp: refreshMaxAge(dateTime),
        nbf: nbf(dateTime), // not valid before .. ? Numeric date?  pads valid time + x MS
        aud: keys.AUDIENCE,
        iss: keys.ISSUER, // URL
        count
    };

    const refreshSettings = {
        expiresIn: '2d',
        algorithms: ['HS256'],
        notBefore: nbfBuffer.toString(),
        audience: keys.AUDIENCE // TODO tenant qualified domain or Oauth   
    };

    const accessPayload = {
        iat: dateTime,
        exp: accessMaxAge(dateTime),
        nbf: nbf(dateTime), // not valid before .. ? Numeric date?  pads valid time + x MS
        sub: id,
        aud: keys.AUDIENCE,
        iss: keys.ISSUER // URL
        // scope?: Scopes;
        // user_metadata: UserMetadata;
        // app_metadata: AppMetadata;
    };

    const accessSettings = {
        expiresIn: '15m',
        algorithms: ['HS256'],
        notBefore: nbfBuffer.toString(),
        audience: keys.AUDIENCE // TODO tenant qualified domain or Oauth   
    };

    // NOTE | Important https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138
    const refresh = jwt.sign(refreshPayload, new Buffer(process.env.JWT_SECRET, 'base64'), refreshSettings);
    const access = jwt.sign(accessPayload, new Buffer(process.env.JWT_SECRET, 'base64'), accessSettings);

    const tokens = Object.freeze({ 
        refresh: { 
            token: refresh, 
            settings: {
                ...COOKIE_SETTINGS,
                maxAge: refreshMaxAge()
            }
        },
        access: {
            token: access,
            settings: {
                ...COOKIE_SETTINGS,
                maxAge: accessMaxAge()
            }
        }
    });

    return tokens;
}