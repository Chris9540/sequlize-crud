"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Op = exports.Model = exports.DataTypes = exports.Server = void 0;
const express = require("express");
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_1.DataTypes; } });
Object.defineProperty(exports, "Op", { enumerable: true, get: function () { return sequelize_1.Op; } });
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return sequelize_1.Model; } });
const path = require("node:path");
const fs = require("node:fs");
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
            throw new TypeError("func must be an async function");
        }
    }
    async _sequelize() {
        const sequelize = new sequelize_1.Sequelize({
            host: "localhost",
            dialect: "postgres",
            logging: false,
            database: "akero",
            username: "postgres",
            password: "postgres",
        });
        const paths = fs.readdirSync(path.join(process.cwd(), this.options.modelsDir));
        const Models = {};
        for (const modelPath of paths) {
            const model = await Promise.resolve(`${path.join(process.cwd(), this.options.modelsDir, modelPath)}`).then(s => require(s));
            const name = modelPath.replace(".js", "").replace(".ts", "");
            Models[name] = model.init(sequelize);
        }
        Object.values(Models)
            .filter((model) => typeof model.associate === 'function')
            .forEach((model) => model.associate(Models));
        this.app.set('Models', Models);
        global.Models = Models;
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
module.exports = exports = { Server, DataTypes: sequelize_1.DataTypes, Model: sequelize_1.Model, Op: sequelize_1.Op };
module.exports.Server = Server;
module.exports.DataTypes = sequelize_1.DataTypes;
module.exports.Model = sequelize_1.Model;
module.exports.Op = sequelize_1.Op;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
//# sourceMappingURL=sequelize-server.js.map