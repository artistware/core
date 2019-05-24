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
    loginFail,
    userNameLong
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
            // // TODO Test against this
            try {
                await schema.validate(args, {
                    abortEarly: false
                });
            } catch (err) {
                return formatYupError(err);
            }

            const {
                email,
                password
            } = args;

            const payload = {
                path: 'email',
                success: false
            };

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
                    return {
                        ...payload,
                        message: loginFail
                    }
                }

            } catch (e) {
                return {
                    ...payload,
                    message: loginFail
                }
            }
        }
    }
};