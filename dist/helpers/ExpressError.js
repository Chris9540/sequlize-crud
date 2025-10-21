"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressError extends Error {
    constructor(options) {
        let { status, message, code } = options;
        if (!message)
            message = 'Express Error';
        super(message);
        if (!code)
            code = 'unknown:error';
        if (!status)
            status = 400;
        if (status < 400 || status > 599)
            status === 400;
        status = Math.floor(status);
        this.statusCode = status;
        this.errorCode = code;
        this.name = 'ExpressError';
    }
}
exports.default = ExpressError;
//# sourceMappingURL=ExpressError.js.map