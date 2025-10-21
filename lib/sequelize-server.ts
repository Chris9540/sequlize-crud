import * as express from "express";
import type { Application } from "express";
import ValidationSchema from "./generate/ValidationSchema";
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
      throw new TypeError('func must be an async function')
    }
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

module.exports = exports = { Server, ValidationSchema }
module.exports.Server = Server
module.exports.ValidationSchema = ValidationSchema

Object.defineProperty(exports, "__esModule", {value: true})

export default { Server, ValidationSchema }

export {
  Server,
  ValidationSchema,
}
