"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHandler = corsHandler;
function corsHandler(req, res, next) {
    res.header("Acces-Control-Allow-Origin", req.header('origin'));
    res.header("Acces-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header("Acces-Control-Allow-Credentials", 'true');
    if (req.method === 'OPTIONS') {
        res.header("Acces-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
}
