/// <reference path='./../../../types/schema.d.ts' />
import * as yup from 'yup';
import formatYupError from './../../../util/formatYupErrors';
import User from './../../../entity/User';
import * as bcrypt from 'bcrypt';
import createTokens from './../../../util/createTokens';

import {
    emailLong,
    emailShort,
    invalidEmail,
    passwordLong,
    passwordShort,
    loginFail
} from '../validators';

import {
    ResolverMap
} from '../../../types/types.common';

const schema = yup.object().shape({
    email: yup
        .string()
        .min(...emailShort)
        .max(...emailLong)
        .email(invalidEmail),
    password: yup
        .string()
        .min(...passwordShort)
        .max(...passwordLong)
});

export const resolvers: ResolverMap = {
    Mutation: {
        login: async (
            _,
            args: GQL.ILoginOnMutationArguments,
            context
        ) => {
            console.log(args);
            console.log('login');
            console.log('reqDef: ', !!context.req);
            console.log('isAuthenticated', context['isAuthenticated']);
            // // TODO Test against this

            const payload = {
                path: 'email',
                success: false
            };

            try {
                await schema.validate(args, {
                    abortEarly: false
                });
            } catch (err) {
                console.log('yuperr', err);
                // NOTE formatYupError(err); <- u could loop to create messages
                return {
                    ...payload,
                    message: err.message
                }
            }

            const {
                email,
                password
            } = args;

            try {
                const user = await User.findOne({
                    where: { email },
                    select: ['password', 'salt', 'id', 'count', 'roles']
                });
                
                const pwMatch = await bcrypt.compare(password, user.password);

                if (pwMatch) {
                    const { id, count, roles } = user;
                    const tokens = createTokens({id, count, roles});
                    console.log(`Access and Refresh for UserID: ${id}`)
                    context.res.cookie('refresh_token', tokens.refresh.token, tokens.refresh.settings);
                    context.res.cookie('access_token', tokens.access.token, tokens.access.settings);
    
                    return {
                        ...payload,
                        success: true,
                        message: 'Login Success'
                    };
                } else {
                    console.log('huh');
                    return {
                        ...payload,
                        message: loginFail
                    }
                }

            } catch (e) {
                console.log('error');
                console.log(e);
                return {
                    ...payload,
                    message: loginFail
                }
            }
        }
    }
};