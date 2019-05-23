/// <reference path='./../../../types/schema.d.ts' />
import * as yup from 'yup';
import formatYupError from './../../../util/formatYupErrors';
import User from './../../../entity/User';

import {
    emailLong,
    emailShort,
    invalidEmail,
    passwordLong,
    passwordShort,
    userNameLong,
    userNameShort,
    registrationSuccess
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
    username: yup
        .string()
        .min(...userNameShort)
        .max(...userNameLong),
    password: yup
        .string()
        .min(...passwordShort)
        .max(...passwordLong)
});

export const resolvers: ResolverMap = {
    Mutation: {
        register: async (
            _,
            args: GQL.IRegisterOnMutationArguments
        ) => {
            try {
                await schema.validate(args, {
                    abortEarly: false
                });
            } catch (err) {
                return formatYupError(err);
            }

            const {
                email,
                password,
                username
            } = args;

            const payload = {
                path: 'email',
                success: false
            };

            try {
                const userExists = await User.getRepository()
                    .createQueryBuilder('users')
                    .where('users.username = :username', { username })
                    .orWhere('users.email = :email', { email })
                    .getCount();

                if (userExists > 0) {
                    return {
                        ...payload,
                        message: invalidEmail
                    };
                }
            } catch {
                // TODO should be a 500
                return  {
                    ...payload,
                    message: 'Server 500'
                }
            }

            const user = User.create({
                email,
                password,
                username
            });

            await user.save();

            return {
                ...payload,
                message: registrationSuccess,
                success: true
            };
        }
    }
};