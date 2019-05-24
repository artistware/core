import e from 'express'; // Default is synthetic import and only brings namespace
// TODO try rollup and check build files
// TODO
// URL
// IP
// etc ... user-agent?
import { ClientInfo } from './../types/types.common';
export default (req: e.Request):ClientInfo => {
    return {
        url: req.protocol + "://" + req.get("host"),
        ip: req.ip
    };
};