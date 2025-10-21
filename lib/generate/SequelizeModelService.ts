import { type Request, type Response, type NextFunction } from "express";
import ExpressError from "../helpers/ExpressError";
import ValidationMiddleware from "./ValidationMiddleware";

type Success<T> = {
  data: T;
};

type Failure<E> = {
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>

type ServiceFunction = (request: Request) => Promise<Result<Record, Error>>;
type ExpressMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => void;

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

export default class SequelizeModelService {
  static get(Model: any): EndpointConfiguration {
    const name = SequelizeModelService.serviceName(Model);
    const method = "get";
    const error = `${name.default}:get`;
    const uri = `/${name.default}/:id`;
    async function service(request: Request): Promise<Result<Record, Error>> {
      const record = await Model.findByPk(request.params.id);
      if (!record) {
        throw new ExpressError({
          status: 404,
          code: `${error}:not-found`,
          message: `404 '${name.default}' Not Found`,
        });
      }
      return record.toJSON();
    }
    const validation = ValidationMiddleware.get(error);
    return {
      method,
      uri,
      error,
      service,
      validation,
    };
  }

  static post(Model: any): EndpointConfiguration {
    const name = SequelizeModelService.serviceName(Model);
    const method = "post";
    const uri = `/${name.default}`;
    const error = `${name.default}:create`;
    async function service(request: Request): Promise<Result<Record, Error>> {
      const { id } = await Model.create(request.body);
      return (await Model.findByPk(id)).toJSON();
    }
    const validation = ValidationMiddleware.post(error, Model.tableAttributes);
    return {
      method,
      uri,
      error,
      service,
      validation,
    };
  }

  static patch(Model: any): EndpointConfiguration {
    const name = SequelizeModelService.serviceName(Model);
    const method = "patch";
    const uri = `/${name.default}/:id`;
    const error = `${name.default}:update`;
    async function service(request: Request): Promise<Result<Record, Error>> {
      const exists = await Model.findByPk(request.params.id);
      if (!exists) {
        throw new ExpressError({
          status: 404,
          code: `${error}:not-found`,
          message: `404 '${name.default}' Not Found`,
        });
      }
      await Model.update(request.body, { where: { id: request.params.id } });
      return (await Model.findByPk(request.params.id)).toJSON();
    }
    const validation = ValidationMiddleware.patch(error, Model.tableAttributes);
    return {
      method,
      uri,
      error,
      service,
      validation,
    };
  }

  static put(Model: any): EndpointConfiguration[] {
    const endpoints:EndpointConfiguration[] = [];
    const name = SequelizeModelService.serviceName(Model);
    const updatedById = Model.tableAttributes.updatedById;
    for (const fieldName in Model.tableAttributes) {
      if (
        ![
          "id",
          "createdAt",
          "createdById",
          "updatedAt",
          "updatedById",
        ].includes(fieldName)
      ) {
        const attribute: FieldAttribute = Model.tableAttributes[fieldName];
        const field = fieldName
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase();
        const method = "put";
        const uri = `/${name.default}/:id/${field}`;
        const error = `${name.default}:update:${field}`;
        async function service(request: Request): Promise<Result<Record, Error>> {
          const exists = await Model.findByPk(request.params.id);
          if (!exists) {
            throw new ExpressError({
              status: 404,
              code: `${error}:not-found`,
              message: `404 '${name.default}' Not Found`,
            });
          }
          const update = {
            [fieldName]: request.body.value,
          }
          if(updatedById) {
            update.updatedById = request.body.updatedById;
          }
          await Model.update(update, { where: { id: request.params.id } })
          return (await Model.findByPk(request.params.id)).toJSON();
        }
        const validation = ValidationMiddleware.put(error, attribute, updatedById)
        endpoints.push({
          method,
          uri,
          error,
          service,
          validation,
        })
      }
    }
    return endpoints;
  }

  static serviceName(Model: any): {
    default: string;
    plural: string;
  } {
    const string: string = Model.tableName.replace(/_/g, "-");
    let plural: string;
    if (string.endsWith("y")) {
      plural = `${string.substring(0, string.length - 1)}ies`;
    } else {
      plural = `${string}s`;
    }
    return {
      default: string,
      plural,
    };
  }
}
