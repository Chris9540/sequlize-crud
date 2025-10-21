"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../helpers/Utils");
const SequelizeModelService_1 = require("./SequelizeModelService");
const ExpressError_1 = require("../helpers/ExpressError");
class ServiceEndpoint {
    static build(app, models) {
        for (const modelName in models) {
            const Model = Utils_1.default.get(models, modelName);
            const endpoints = [
                SequelizeModelService_1.default.post(Model),
                SequelizeModelService_1.default.patch(Model),
                ...SequelizeModelService_1.default.put(Model),
                SequelizeModelService_1.default.get(Model),
            ];
            for (const { method, uri, error, validation, service } of endpoints) {
                app[method](uri, validation, (request, response, next) => {
                    service(request)
                        .then((data) => {
                        response.status(200).send(data);
                    })
                        .catch((exception) => {
                        if (exception instanceof ExpressError_1.default) {
                            next(exception);
                        }
                        else {
                            next(new ExpressError_1.default({
                                status: 500,
                                code: error,
                                message: exception.toString(),
                            }));
                        }
                    });
                });
            }
        }
    }
}
exports.default = ServiceEndpoint;
//# sourceMappingURL=ServiceEnpoint.js.map