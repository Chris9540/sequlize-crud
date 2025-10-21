import Utils from "../helpers/Utils";
import SequelizeModelService from "./SequelizeModelService";
import ExpressError from "../helpers/ExpressError";
import type { Request, Response, NextFunction, Application } from "express";

export default class ServiceEndpoint {
  static build(app: Application, models: any) {
    for (const modelName in models) {
      const Model = Utils.get(models, modelName);
      const endpoints = [
        SequelizeModelService.post(Model),
        SequelizeModelService.patch(Model),
        ...SequelizeModelService.put(Model),
        SequelizeModelService.get(Model),
      ];
      for (const { method, uri, error, validation, service } of endpoints) {
        app[method](
          uri,
          validation,
          (request: Request, response: Response, next: NextFunction) => {
            service(request)
              .then((data) => {
                response.status(200).send(data);
              })
              .catch((exception) => {
                if (exception instanceof ExpressError) {
                  next(exception);
                } else {
                  next(
                    new ExpressError({
                      status: 500,
                      code: error,
                      message: exception.toString(),
                    })
                  );
                }
              });
          }
        );
      }
    }
  }
}
