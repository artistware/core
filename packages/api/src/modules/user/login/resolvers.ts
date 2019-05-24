/// <reference path='./../../../types/schema.d.ts' />
import * as yup from 'yup';
import formatYupError from './../../../util/formatYupErrors';
import User from './../../../entity/User';
import * as bcrypt from 'bcrypt';

import {
    emailLong,
    emailShort,
    invalidEmail,
    passwordLong,
    passwordShort,
    registrationSuccess,
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
            args: GQL.ILoginOnMutationArguments
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
                    select: ['password', 'salt']
                });
                
                const pwMatch = await bcrypt.compare(password, user.password);

                if (pwMatch) {
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

            } catch {
                return {
                    ...payload,
                    message: loginFail
                }
            }
        }
    }
};