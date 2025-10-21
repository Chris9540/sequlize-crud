import { type Request, type Response, type NextFunction } from "express";
type Success<T> = {
    data: T;
};
type Failure<E> = {
    error: E;
};
type Result<T, E = Error> = Success<T> | Failure<E>;
type ServiceFunction = (request: Request) => Promise<Result<Record, Error>>;
type ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => void;
type EndpointConfiguration = {
    method: "post" | "patch" | "put" | "get" | "delete";
    error: string;
    uri: string;
    service: ServiceFunction;
    validation: ExpressMiddleware;
};
interface Record {
    [U: string]: string | number | boolean | Record[] | Record;
}
export default class SequelizeModelService {
    static get(Model: any): EndpointConfiguration;
    static post(Model: any): EndpointConfiguration;
    static patch(Model: any): EndpointConfiguration;
    static put(Model: any): EndpointConfiguration[];
    static serviceName(Model: any): {
        default: string;
        plural: string;
    };
}
export {};
