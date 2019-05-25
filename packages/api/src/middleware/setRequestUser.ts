import * as jwt from 'jsonwebtoken';
import User from './../entity/User';
import {AccessTokenPayload} from './../types/types.common';
import createTokens from './../util/createTokens';

// TODO 15 min redis cash over a everytime refresh check
export default async function setRequestUser (req, res, next) {
    const refreshToken = req.signedCookies['refresh_token'];
    const accessToken = req.signedCookies['access_token'];
    if (!refreshToken && !accessToken) return next();
    
    let _id:string;
    try {
        const data = jwt.verify(accessToken, Buffer.from(process.env.JWT_SECRET, 'base64')) as AccessTokenPayload;
        _id = data.sub;
    } catch (e) {
        console.log('invalid access token');
    }

    if (!refreshToken) return next();

    let data;

    try {
        data = jwt.verify(refreshToken, Buffer.from(process.env.JWT_SECRET, 'base64'));
    } catch (e) {
        console.log('invalid refresh token');
        return next();
    }

    const u = await User.findOne({
        where: { id: _id },
        select: ['count', 'roles']
    });

    if (!u || u.count !== data.count) {
        console.log('intentional invalidation');
        return next();
    }

    const { id, count, roles } = u;
    const tokens = createTokens({ id, count, roles });
    
    console.log(`Access and Refresh for UserID: ${id}`);
    res.cookie('refresh_token', tokens.refresh.token, tokens.refresh.settings);
    res.cookie('access_token', tokens.access.token, tokens.access.settings);
    req.user = { id, roles };
    next();
}