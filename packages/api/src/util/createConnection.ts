import {
    // getConnectionOptions,
    createConnection
} from 'typeorm';

const create = async (resetDB: boolean = false) => {
    try {
        // NOTE ormconfig style ... using .env | possibly yaml in future
        // const connectionOptions = await getConnectionOptions(process.env.NODE_ENV); 

        const connect = await createConnection();
        await connect.synchronize(resetDB);
        // TODO test to prod settings programattically
        return connect;
    } catch (e) {
        throw new Error(e);
    }
};

export default create;