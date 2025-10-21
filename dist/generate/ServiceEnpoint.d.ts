import type { Application } from "express";
export default class ServiceEndpoint {
    static build(app: Application, models: any): void;
}
