import type { Application } from "express";
import { DataTypes, Op, Model } from "sequelize";
declare global {
    var Models: {
        [name: string]: any;
    };
}
type ServerOptions = {
    port: number;
    modelsDir: string;
    docsDir: string;
};
type InitializeFunction = () => Promise<void>;
type CallbackFunction = (app: Application, port: number) => void;
declare class Server {
    private options;
    private init;
    private app;
    constructor(options: ServerOptions);
    initialize(func: InitializeFunction): void;
    _sequelize(): Promise<void>;
    start(callback?: CallbackFunction): void;
}
export default Server;
export { Server, DataTypes, Model, Op };
