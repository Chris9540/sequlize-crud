"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../helpers/Utils");
const ajv_1 = require("ajv");
const ExpressError_1 = require("../helpers/ExpressError");
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
class ValidationCompiler {
    static get() {
        return ValidationCompiler.compile({
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
        });
    }
    static post(attributes) {
        return ValidationCompiler.compile({
            $async: true,
            type: "object",
            additionalProperties: false,
            required: ["body"],
            properties: {
                body: {
                    $async: true,
                    type: "object",
                    additionalProperties: false,
                    required: ValidationCompiler.required(attributes),
                    properties: ValidationCompiler.properties(attributes),
                },
            },
        });
    }
    static patch(attributes) {
        return ValidationCompiler.compile({
            $async: true,
            type: "object",
            required: ["params", "body"],
            additionalProperties: false,
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
                body: {
                    $async: true,
                    type: "object",
                    additionalProperties: false,
                    required: ValidationCompiler.required(attributes),
                    properties: ValidationCompiler.properties(attributes),
                },
            },
        });
    }
    static put(attribute, updatedById) {
        const required = ["value"];
        if (updatedById) {
            required.push("updatedById");
        }
        return ValidationCompiler.compile({
            $async: true,
            type: "object",
            required: ["params", "body"],
            additionalProperties: false,
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
                body: {
                    $async: true,
                    type: "object",
                    additionalProperties: false,
                    required,
                    properties: {
                        ...ValidationCompiler.property("value", attribute),
                        ...(updatedById &&
                            ValidationCompiler.property("updatedById", updatedById)),
                    },
                },
            },
        });
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
    static property(fieldName, field) {
        const schema = {
            [fieldName]: {
                $async: true,
                type: Utils_1.default.get(fieldTypes, field.type.key.toLowerCase()),
            },
        };
        if (!Utils_1.default.has(field, "references") && field.allowNull === true) {
            schema[fieldName].nullable = true;
        }
        if (field.type.toSql().startsWith("VARCHAR")) {
            schema[fieldName].maxLength = Number(field.type.toSql().replace("VARCHAR(", "").replace(")", ""));
        }
        return schema;
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
    static compile(schema) {
        const ajv = new ajv_1.default({ strict: false });
        const validate = ajv.compile(schema);
        return async function (data) {
            try {
                await validate(data);
                return null;
            }
            catch (e) {
                const oneOf = e.errors.find((i) => i.keyword === "oneOf");
                if (oneOf) {
                    const message = [];
                    let path = "";
                    for (const error of e.errors) {
                        if (error.keyword === "oneOf") {
                            path = `${error.instancePath
                                .substring(1, error.instancePath.length)
                                .replaceAll("/", ".")}`;
                        }
                        else {
                            message.push(error.message);
                        }
                    }
                    return `${path} ${message.join(" OR ")}`;
                }
                else {
                    const { instancePath, message } = e.errors[0];
                    return `${instancePath
                        .substring(1, instancePath.length)
                        .replaceAll("/", ".")} ${message}`;
                }
            }
        };
    }
}
class ValidationMiddleware {
    static get(error) {
        const validate = ValidationCompiler.get();
        return ValidationMiddleware.compile(error, validate, ["params"]);
    }
    static post(error, attributes) {
        const validate = ValidationCompiler.post(attributes);
        return ValidationMiddleware.compile(error, validate, ["body"]);
    }
    static patch(error, attributes) {
        const validate = ValidationCompiler.patch(attributes);
        return ValidationMiddleware.compile(error, validate, ["params", "body"]);
    }
    static put(error, attribute, updatedById) {
        const validate = ValidationCompiler.put(attribute, updatedById);
        return ValidationMiddleware.compile(error, validate, ["params", "body"]);
    }
    static compile(error, validate, required) {
        return function (request, _response, next) {
            const data = {};
            for (const section of required) {
                if (Utils_1.default.has(request, section) &&
                    Utils_1.default.isObject(Utils_1.default.get(request, section))) {
                    data[section] = Utils_1.default.get(request, section);
                }
                else {
                    data[section] = {};
                }
            }
            validate(data).then((message) => {
                if (message) {
                    next(new ExpressError_1.default({
                        status: 412,
                        message,
                        code: `${error}:validation`,
                    }));
                }
                else {
                    next();
                }
            });
        };
    }
}
exports.default = ValidationMiddleware;
//# sourceMappingURL=ValidationMiddleware.js.map