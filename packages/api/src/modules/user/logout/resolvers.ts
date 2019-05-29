/// <reference path='./../../../types/schema.d.ts' />
import SETTINGS, { REDIS_SESSION_PF, _redisTTL } from './../../../config/settings';

import {
    ResolverMap
} from '../../../types/types.common';

const { COOKIE_SETTINGS, refreshMaxAge, accessMaxAge } = SETTINGS;

export const resolvers: ResolverMap = {
    Mutation: {
        logout: async (
            _,
            __,
            context
        ) => {
            const payload = {
                path: 'logout',
                success: false
            };

            const { user } = context.req;

            if (!user) {
                return {
                    ...payload,
                    success: false,
                    message: 'You are not autheniticated.'
                }
            }

            await context.redis.del(`${REDIS_SESSION_PF}${user.sub}`);
            context.res.clearCookie('access_token', { ...COOKIE_SETTINGS, maxAge: accessMaxAge() });
            context.res.clearCookie('refresh_token', { ...COOKIE_SETTINGS, maxAge: refreshMaxAge() });

            return {
                ...payload,
                success: true,
                message: 'You are now logged out.'
            }
        }
    }
};