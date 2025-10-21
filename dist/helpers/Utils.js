"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class Utils {
    static has(value, field) {
        return (0, lodash_1.has)(value, field);
    }
    static isObject(value) {
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
    }
    static get(object, field) {
        return (0, lodash_1.get)(object, field);
    }
}
exports.default = Utils;
//# sourceMappingURL=Utils.js.map