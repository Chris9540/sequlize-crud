"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressError_1 = require("../helpers/ExpressError");
const ValidationMiddleware_1 = require("./ValidationMiddleware");
class SequelizeModelService {
    static get(Model) {
        const name = SequelizeModelService.serviceName(Model);
        const method = "get";
        const error = `${name.default}:get`;
        const uri = `/${name.default}/:id`;
        async function service(request) {
            const record = await Model.findByPk(request.params.id);
            if (!record) {
                throw new ExpressError_1.default({
                    status: 404,
                    code: `${error}:not-found`,
                    message: `404 '${name.default}' Not Found`,
                });
            }
            return record.toJSON();
        }
        const validation = ValidationMiddleware_1.default.get(error);
        return {
            method,
            uri,
            error,
            service,
            validation,
        };
    }
    static post(Model) {
        const name = SequelizeModelService.serviceName(Model);
        const method = "post";
        const uri = `/${name.default}`;
        const error = `${name.default}:create`;
        async function service(request) {
            const { id } = await Model.create(request.body);
            return (await Model.findByPk(id)).toJSON();
        }
        const validation = ValidationMiddleware_1.default.post(error, Model.tableAttributes);
        return {
            method,
            uri,
            error,
            service,
            validation,
        };
    }
    static patch(Model) {
        const name = SequelizeModelService.serviceName(Model);
        const method = "patch";
        const uri = `/${name.default}/:id`;
        const error = `${name.default}:update`;
        async function service(request) {
            const exists = await Model.findByPk(request.params.id);
            if (!exists) {
                throw new ExpressError_1.default({
                    status: 404,
                    code: `${error}:not-found`,
                    message: `404 '${name.default}' Not Found`,
                });
            }
            await Model.update(request.body, { where: { id: request.params.id } });
            return (await Model.findByPk(request.params.id)).toJSON();
        }
        const validation = ValidationMiddleware_1.default.patch(error, Model.tableAttributes);
        return {
            method,
            uri,
            error,
            service,
            validation,
        };
    }
    static put(Model) {
        const endpoints = [];
        const name = SequelizeModelService.serviceName(Model);
        const updatedById = Model.tableAttributes.updatedById;
        for (const fieldName in Model.tableAttributes) {
            if (![
                "id",
                "createdAt",
                "createdById",
                "updatedAt",
                "updatedById",
            ].includes(fieldName)) {
                const attribute = Model.tableAttributes[fieldName];
                const field = fieldName
                    .replace(/([a-z])([A-Z])/g, "$1-$2")
                    .toLowerCase();
                const method = "put";
                const uri = `/${name.default}/:id/${field}`;
                const error = `${name.default}:update:${field}`;
                async function service(request) {
                    const exists = await Model.findByPk(request.params.id);
                    if (!exists) {
                        throw new ExpressError_1.default({
                            status: 404,
                            code: `${error}:not-found`,
                            message: `404 '${name.default}' Not Found`,
                        });
                    }
                    const update = {
                        [fieldName]: request.body.value,
                    };
                    if (updatedById) {
                        update.updatedById = request.body.updatedById;
                    }
                    await Model.update(update, { where: { id: request.params.id } });
                    return (await Model.findByPk(request.params.id)).toJSON();
                }
                const validation = ValidationMiddleware_1.default.put(error, attribute, updatedById);
                endpoints.push({
                    method,
                    uri,
                    error,
                    service,
                    validation,
                });
            }
        }
        return endpoints;
    }
    static serviceName(Model) {
        const string = Model.tableName.replace(/_/g, "-");
        let plural;
        if (string.endsWith("y")) {
            plural = `${string.substring(0, string.length - 1)}ies`;
        }
        else {
            plural = `${string}s`;
        }
        return {
            default: string,
            plural,
        };
    }
}
exports.default = SequelizeModelService;
//# sourceMappingURL=SequelizeModelService.js.map