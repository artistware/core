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
    userNameShort
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
            args: any
            // { redis, url }
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
                password
            } = args;

            const userAlreadyExists = await User.findOne({
                where: {
                    email
                },
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [{
                    path: "email",
                    message: invalidEmail
                }];
            }

            const user = User.create({
                email,
                password
            });

            await user.save();

            // if (process.env.NODE_ENV !== "test") {
            //   await sendEmail(
            //     email,
            //     await createConfirmEmailLink(url, user.id, redis)
            //   );
            // }

            return null;
        }
    }
};