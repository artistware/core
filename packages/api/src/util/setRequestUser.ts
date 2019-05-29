import * as jwt from 'jsonwebtoken';
import User from './../entity/User';
import {AccessTokenPayload, AuthenticatedRequest, AppMetadata, RefreshTokenPayload} from './../types/types.common';
import createTokens from './../util/createTokens';
import { Redis } from "ioredis";
import { REDIS_SESSION_PF, _redisTTL } from './../config/settings';

// stateless jwt verify, stateful 5 min ttl redis sessions.
// when redis expires we will look at invalidated User and check against the DB
// saves about 20ms per req
export default function setRequestUser (redis: Redis) {
    return async function (req: AuthenticatedRequest, res, next) {
        // console.time('setReqUser');
        const refreshToken = req.signedCookies['refresh_token'];
        const accessToken = req.signedCookies['access_token'];
        if (!refreshToken && !accessToken) return next();
        
        let _id:string;
        let _app_metadata:AppMetadata;
        try {
            const data = jwt.verify(accessToken, Buffer.from(process.env.JWT_SECRET, 'base64')) as AccessTokenPayload;
            _id = data.sub.toString();
            _app_metadata = data.app_metadata;
            
        } catch (e) {
            console.log('invalid access token: ', e.msg);
        }

        if (!refreshToken) return next();

        let data;

        try {
            data = jwt.verify(refreshToken, Buffer.from(process.env.JWT_SECRET, 'base64')) as RefreshTokenPayload;
        } catch (e) {
            console.log('invalid refresh token: ', e.message);
            return next();
        }


        // HERE you can check the id against redis.  If redis is alive skip the db lookup
        const rsess = await redis.get(`${REDIS_SESSION_PF}${_id}`);
        console.log('rsess', rsess);
        if (!rsess) {
            // check the user and populate the tokens with user data
            const u = await User.findOne({
                where: { id: _id },
                select: ['count', 'roles']
            });
    
            if (!u || u.count !== data.count) { // TODO invalidate api
                console.log('intentional invalidation');
                return next();
            }

            const { count, roles } = u;
            const tokens = createTokens({ id: _id, count, roles });
            
            console.log(`Access and Refresh for UserID: ${_id} and new Redis session`);
            await redis.set(`${REDIS_SESSION_PF}${_id}`, req.sessionID, 'PX', _redisTTL); // 5 min NOTE consider no dupe
            res.cookie('refresh_token', tokens.refresh.token, tokens.refresh.settings);
            res.cookie('access_token', tokens.access.token, tokens.access.settings);
            req.user = { sub: _id, app_metadata: _app_metadata };
            // console.timeEnd('setReqUser');
            return next();
        } else {
            // redis session is still active
            // populate the tokens with prior jwt data
            const { count } = data;
            const { roles } = _app_metadata;
            const tokens = createTokens({ id: _id, count, roles });
            
            console.log(`Access and Refresh for UserID: ${_id}`);
            res.cookie('refresh_token', tokens.refresh.token, tokens.refresh.settings);
            res.cookie('access_token', tokens.access.token, tokens.access.settings);
            req.user = { sub: _id, app_metadata: _app_metadata };
            // console.timeEnd('setReqUser');
            return next();
        }
    }
}