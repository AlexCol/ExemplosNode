"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = routeNotFound;
function routeNotFound(req, res, next) {
    const error = new Error("Route Not Found");
    logging.error(error.message);
    return res.status(404).json({ error: error.message });
}
