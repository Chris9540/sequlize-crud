import { type Request, type Response, type NextFunction } from "express";
type FieldAttribute = {
    _modelAttribute: boolean;
    allowNull: boolean;
    field: string;
    fieldName: string;
    defaultValue: string | number | boolean;
    type: {
        toSql: () => string;
        key: string;
        _length?: number;
    };
};
interface FieldAttributes {
    [U: string]: FieldAttribute;
}
type ValidateFunction = (data: object) => Promise<null | string>;
type ValidationMiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void;
export default class ValidationMiddleware {
    static get(error: string): ValidationMiddlewareFunction;
    static post(error: string, attributes: FieldAttributes): ValidationMiddlewareFunction;
    static patch(error: string, attributes: FieldAttributes): ValidationMiddlewareFunction;
    static put(error: string, attribute: FieldAttribute, updatedById: FieldAttribute): ValidationMiddlewareFunction;
    static compile(error: string, validate: ValidateFunction, required: string[]): ValidationMiddlewareFunction;
}
export {};
