import Utils from "../helpers/Utils";
import Ajv, { AsyncSchema } from "ajv";
import { type Request, type Response, type NextFunction } from "express";
import ExpressError from "../helpers/ExpressError";
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

interface Schema {
  [U: string]: AsyncSchema;
}

type ValidateFunction = (data: object) => Promise<null | string>;

class ValidationCompiler {
  static get(): ValidateFunction {
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

  static post(attributes: FieldAttributes): ValidateFunction {
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

  static patch(attributes: FieldAttributes): ValidateFunction {
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

  static put(
    attribute: FieldAttribute,
    updatedById: FieldAttribute
  ): ValidateFunction {
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

  static required(attributes: FieldAttributes): string[] {
    const fields = [];
    for (const fieldName in attributes) {
      if (!["id", "createdAt", "updatedAt"].includes(fieldName)) {
        const field = attributes[fieldName];
        const reference = Utils.has(field, "references");
        const allowNull = Utils.has(field, "allowNull")
          ? field.allowNull
          : true;
        const hasDefault = Utils.has(field, "defaultValue");
        if (reference || (allowNull === false && hasDefault === false)) {
          fields.push(fieldName);
        }
      }
    }
    return fields;
  }

  static property(fieldName: string, field: FieldAttribute): Schema {
    const schema: Schema = {
      [fieldName]: {
        $async: true,
        type: Utils.get(fieldTypes, field.type.key.toLowerCase()),
      },
    };
    if (!Utils.has(field, "references") && field.allowNull === true) {
      schema[fieldName].nullable = true;
    }
    if (field.type.toSql().startsWith("VARCHAR")) {
      schema[fieldName].maxLength = Number(
        field.type.toSql().replace("VARCHAR(", "").replace(")", "")
      );
    }
    return schema;
  }

  static properties(attributes: FieldAttributes): Schema {
    const fields: Schema = {};
    for (const fieldName in attributes) {
      if (!["id", "createdAt", "updatedAt"].includes(fieldName)) {
        const field: FieldAttribute = attributes[fieldName];
        fields[fieldName] = {
          $async: true,
          type: Utils.get(fieldTypes, field.type.key.toLowerCase()),
        };
        if (!Utils.has(field, "references") && field.allowNull === true) {
          fields[fieldName].nullable = true;
        }
        if (field.type.toSql().startsWith("VARCHAR")) {
          fields[fieldName].maxLength = Number(
            field.type.toSql().replace("VARCHAR(", "").replace(")", "")
          );
        }
      }
    }
    return fields;
  }

  static compile(schema: AsyncSchema): ValidateFunction {
    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(schema);
    return async function (data: object): Promise<string | null> {
      try {
        await validate(data);
        return null;
      } catch (e: any) {
        const oneOf = e.errors.find((i: any) => i.keyword === "oneOf");
        if (oneOf) {
          const message = [];
          let path = "";
          for (const error of e.errors) {
            if (error.keyword === "oneOf") {
              path = `${error.instancePath
                .substring(1, error.instancePath.length)
                .replaceAll("/", ".")}`;
            } else {
              message.push(error.message);
            }
          }
          return `${path} ${message.join(" OR ")}`;
        } else {
          const { instancePath, message } = e.errors[0];
          return `${instancePath
            .substring(1, instancePath.length)
            .replaceAll("/", ".")} ${message}`;
        }
      }
    };
  }
}

type ValidationMiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => void;

export default class ValidationMiddleware {
  static get(error: string): ValidationMiddlewareFunction {
    const validate = ValidationCompiler.get();
    return ValidationMiddleware.compile(error, validate, ["params"]);
  }

  static post(
    error: string,
    attributes: FieldAttributes
  ): ValidationMiddlewareFunction {
    const validate = ValidationCompiler.post(attributes);
    return ValidationMiddleware.compile(error, validate, ["body"]);
  }

  static patch(
    error: string,
    attributes: FieldAttributes
  ): ValidationMiddlewareFunction {
    const validate = ValidationCompiler.patch(attributes);
    return ValidationMiddleware.compile(error, validate, ["params", "body"]);
  }

  static put(
    error: string,
    attribute: FieldAttribute,
    updatedById: FieldAttribute
  ): ValidationMiddlewareFunction {
    const validate = ValidationCompiler.put(attribute, updatedById);
    return ValidationMiddleware.compile(error, validate, ["params", "body"]);
  }

  static compile(
    error: string,
    validate: ValidateFunction,
    required: string[]
  ): ValidationMiddlewareFunction {
    return function (
      request: Request,
      _response: Response,
      next: NextFunction
    ) {
      const data: any = {};
      for (const section of required) {
        if (
          Utils.has(request, section) &&
          Utils.isObject(Utils.get(request, section))
        ) {
          data[section] = Utils.get(request, section);
        } else {
          data[section] = {};
        }
      }

      validate(data).then((message) => {
        if (message) {
          next(
            new ExpressError({
              status: 412,
              message,
              code: `${error}:validation`,
            })
          );
        } else {
          next();
        }
      });
    };
  }
}
