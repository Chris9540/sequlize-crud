import type { Application } from "express";
import ValidationSchema from "./generate/ValidationSchema";
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
    start(callback?: CallbackFunction): void;
}
declare const _default: {
    Server: typeof Server;
    ValidationSchema: typeof ValidationSchema;
};
export default _default;
export { Server, ValidationSchema, };
