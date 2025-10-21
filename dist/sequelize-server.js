"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSchema = exports.Server = void 0;
const express = require("express");
const ValidationSchema_1 = require("./generate/ValidationSchema");
exports.ValidationSchema = ValidationSchema_1.default;
class Server {
    constructor(options) {
        this.options = options;
        this.app = express();
        this.init = async () => { };
    }
    initialize(func) {
        if (func && typeof func === "function") {
            this.init = func;
        }
        else {
            throw new TypeError('func must be an async function');
        }
    }
    start(callback) {
        this.init().then(() => {
            this.app.listen(this.options.port, () => {
                if (callback && typeof callback === "function") {
                    callback(this.app, this.options.port);
                }
            });
        });
    }
}
exports.Server = Server;
module.exports = exports = { Server, ValidationSchema: ValidationSchema_1.default };
module.exports.Server = Server;
module.exports.ValidationSchema = ValidationSchema_1.default;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { Server, ValidationSchema: ValidationSchema_1.default };
//# sourceMappingURL=sequelize-server.js.map