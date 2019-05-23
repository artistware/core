import {
    getConnectionOptions,
    createConnection
} from 'typeorm';

const create = async (resetDB: boolean = false) => {
    try {
        // const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
        const connect = await createConnection();
        await connect.synchronize();
        // TODO test to prod settings programattically
        return connect;
    } catch (e) {
        throw new Error(e);
    }
};

export default create;