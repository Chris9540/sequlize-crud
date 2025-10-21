import Utils from "../helpers/Utils";
import type { AsyncSchema } from "ajv";
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

export default class ValidationSchema {
  static GET(): AsyncSchema {
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

  static POST(attributes: FieldAttributes): AsyncSchema {
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
    return schema as AsyncSchema;
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
        const hasDefault = Utils.has(field, "defaultValue")
        if (reference || (allowNull === false  && hasDefault === false)) {
          fields.push(fieldName);
        }
      }
    }
    return fields;
  }

  static properties(attributes: FieldAttributes): {
    [name: string]: AsyncSchema;
  } {
    const fields: {
      [name: string]: {
        $async: true;
        type: string;
        nullable?: boolean;
        maxLength?: number;
      };
    } = {};
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
}
