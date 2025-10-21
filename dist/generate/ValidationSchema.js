"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../helpers/Utils");
const fieldTypes = {
    string: "string",
    char: "string",
    text: "string",
    number: "number",
    tinyint: "number",
    smallint: "number",
    mediumint: "number",
    integer: "number",
    bigint: "string",
    float: "number",
    time: "string",
    date: "string",
    dateonly: "string",
    boolean: "boolean",
    now: "string",
    decimal: "number",
    uuid: "string",
    uuidv1: "string",
    uuidv4: "string",
};
class ValidationSchema {
    static GET() {
        return {
            $async: true,
            type: "object",
            required: ["params"],
            properties: {
                params: {
                    $async: true,
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            $async: true,
                            type: "string",
                            nullable: false,
                        },
                    },
                    additionalProperties: false,
                },
            },
            additionalProperties: false,
        };
    }
    static POST(attributes) {
        const schema = {
            $async: true,
            type: "object",
            additionalProperties: false,
            required: ["body"],
            properties: {
                body: {
                    $async: true,
                    type: "object",
                    additionalProperties: false,
                    required: ValidationSchema.required(attributes),
                    properties: ValidationSchema.properties(attributes),
                },
            },
        };
        return schema;
    }
    static required(attributes) {
        const fields = [];
        for (const fieldName in attributes) {
            if (!["id", "createdAt", "updatedAt"].includes(fieldName)) {
                const field = attributes[fieldName];
                const reference = Utils_1.default.has(field, "references");
                const allowNull = Utils_1.default.has(field, "allowNull")
                    ? field.allowNull
                    : true;
                const hasDefault = Utils_1.default.has(field, "defaultValue");
                if (reference || (allowNull === false && hasDefault === false)) {
                    fields.push(fieldName);
                }
            }
        }
        return fields;
    }
    static properties(attributes) {
        const fields = {};
        for (const fieldName in attributes) {
            if (!["id", "createdAt", "updatedAt"].includes(fieldName)) {
                const field = attributes[fieldName];
                fields[fieldName] = {
                    $async: true,
                    type: Utils_1.default.get(fieldTypes, field.type.key.toLowerCase()),
                };
                if (!Utils_1.default.has(field, "references") && field.allowNull === true) {
                    fields[fieldName].nullable = true;
                }
                if (field.type.toSql().startsWith("VARCHAR")) {
                    fields[fieldName].maxLength = Number(field.type.toSql().replace("VARCHAR(", "").replace(")", ""));
                }
            }
        }
        return fields;
    }
}
exports.default = ValidationSchema;
//# sourceMappingURL=ValidationSchema.js.map