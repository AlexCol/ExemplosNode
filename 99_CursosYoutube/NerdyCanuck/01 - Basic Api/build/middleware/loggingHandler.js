"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logginHandler = logginHandler;
function logginHandler(req, res, next) {
    logging.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on("finish", () => {
        logging.log(`Incomming - METHOD [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] -> STATUS: [${res.statusCode}]`);
    });
    next();
}
