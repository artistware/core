import {Context} from './../types/types.common';
export default function apolloLogging (ctx: Context) {
    console.log('requser checked at server: ', ctx.req.user);
    console.log('Query: ', ctx.req.body.query.replace(/\n/g, ''));
}