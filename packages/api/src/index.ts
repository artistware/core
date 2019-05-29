import start from './server';
// import http from 'http'; // TODO dev 
// import https from 'https'; // TODO prod

(async () => {
    try {
        const server = await start();
        const PORT = server.get('LISTENING_PORT');
        server.listen(PORT || 3000, () => console.log(`listening on ${PORT}`));

        // const server = await start();
        // server.listen().then(({ url }) => {
        //     console.log(`🚀 Server ready at ${url}`);
        // });
    } catch (e) {
        console.log(e);
        // TODO intricate pro error handling for grown ups
        // TODO super pro e logging
        // TODO graphql e logging
    }
})();
