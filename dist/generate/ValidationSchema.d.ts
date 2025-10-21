import type { AsyncSchema } from "ajv";
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
export default class ValidationSchema {
    static GET(): AsyncSchema;
    static POST(attributes: FieldAttributes): AsyncSchema;
    static required(attributes: FieldAttributes): string[];
    static properties(attributes: FieldAttributes): {
        [name: string]: AsyncSchema;
    };
}
export {};
