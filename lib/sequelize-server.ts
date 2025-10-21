import * as express from "express";
import type { Application } from "express";
import { Sequelize, DataTypes, Op, Model } from "sequelize";
import * as path from "node:path";
import * as fs from "node:fs";


declare global {
  var Models: { [name: string]: any };
}

type ServerOptions = {
  port: number;
  modelsDir: string;
  docsDir: string;
};

type InitializeFunction = () => Promise<void>;
type CallbackFunction = (app: Application, port: number) => void;

class Server {
  private options: ServerOptions;
  private init: InitializeFunction;
  private app: Application;
  constructor(options: ServerOptions) {
    this.options = options;
    this.app = express();
    this.init = async () => {};
  }

  initialize(func: InitializeFunction): void {
    if (func && typeof func === "function") {
      this.init = func;
    } else {
      throw new TypeError("func must be an async function");
    }
  }

  async _sequelize() {
    const sequelize = new Sequelize({
      host: "localhost",
      dialect: "postgres",
      logging: false,
      database: "akero",
      username: "postgres",
      password: "postgres",
    });
    const paths = fs.readdirSync(
      path.join(process.cwd(), this.options.modelsDir)
    );
    const Models: { [name: string]: any } = {};
    for (const modelPath of paths) {
      const model = await import(
        path.join(process.cwd(), this.options.modelsDir, modelPath)
      );
      const name = modelPath.replace(".js", "").replace(".ts", "");
      Models[name] = model.init(sequelize);
    }
    Object.values(Models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(Models));
    this.app.set('Models', Models);
    global.Models = Models;
  }

  start(callback?: CallbackFunction): void {
    this.init().then(() => {
      this.app.listen(this.options.port, () => {
        if (callback && typeof callback === "function") {
          callback(this.app, this.options.port);
        }
      });
    });
  }
}

module.exports = exports = { Server, DataTypes, Model, Op };
module.exports.Server = Server;
module.exports.DataTypes = DataTypes;
module.exports.Model = Model;
module.exports.Op = Op;

Object.defineProperty(exports, "__esModule", { value: true });

export default Server;

export { Server, DataTypes, Model, Op };
