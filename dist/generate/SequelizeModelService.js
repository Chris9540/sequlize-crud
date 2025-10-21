"use strict";
// import type { ModelDefined } from "sequelize";
// import type { Request, Response, NextFunction } from "express";
// type ServiceFunction = (request: Request) => object;
// type ExpressMiddleware = (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => void;
// type EndpointConfiguration = {
//   method: "post" | "patch" | "put" | "get" | "delete";
//   error: string;
//   uri: string;
//   service: ServiceFunction;
//   validation: ExpressMiddleware;
// };
// export default class SequelizeModelService {
//   static build(Model: ModelDefined<object, object>): EndpointConfiguration[] {
//     const name = SequelizeModelService.serviceName(Model);
//     return [
//       SequelizeModelService.POST(name.default, Model),
//       SequelizeModelService.COPY(name.default, Model),
//       SequelizeModelService.PATCH(name.default, Model),
//       ...SequelizeModelService.PUT(name.default, Model),
//       SequelizeModelService.GET(name.default, Model),
//       SequelizeModelService.FIND(name.plural, Model),
//       ...SequelizeModelService.ROUTES(name, Model),
//     ];
//   }
//   static serviceName(Model: ModelDefined<object, object>): {
//     default: string;
//     plural: string;
//   } {
//     const string: string = Model.tableName.replace(/_/g, "-");
//     let plural: string;
//     if (string.endsWith("y")) {
//       plural = `${string.substring(0, string.length - 1)}ies`;
//     } else {
//       plural = `${string}s`;
//     }
//     return {
//       default: string,
//       plural,
//     };
//   }
//   static GET(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:get`;
//     const uri: string = `/${name}/:id`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "get",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static FIND(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:find`;
//     const uri: string = `/${name}`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "get",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static POST(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:create`;
//     const uri: string = `/${name}`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "post",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static COPY(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:copy`;
//     const uri: string = `/${name}`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "post",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static PATCH(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:update`;
//     const uri: string = `/${name}/:id`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "patch",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static PUT(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration[] {
//     const error: string = `${name}:update:field-name`;
//     const uri: string = `/${name}/:id/field-name`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return [
//       {
//         method: "put",
//         uri,
//         error,
//         service,
//         validation,
//       },
//     ];
//   }
//   static DELETE(
//     name: string,
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration {
//     const error: string = `${name}:delete`;
//     const uri: string = `/${name}/:id`;
//     function service(request: Request): object {
//       return {};
//     }
//     function validation(
//       request: Request,
//       response: Response,
//       next: NextFunction
//     ): void {}
//     return {
//       method: "delete",
//       uri,
//       error,
//       service,
//       validation,
//     };
//   }
//   static ROUTES(
//     name: { default: string; plural: string },
//     Model: ModelDefined<object, object>
//   ): EndpointConfiguration[] {
//     return [];
//   }
// }
//# sourceMappingURL=SequelizeModelService.js.map