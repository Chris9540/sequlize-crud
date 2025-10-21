import { has, get } from 'lodash'

export default class Utils {

  static has(value:object, field:string):boolean {
    return has(value, field);
  }

  static isObject(value:object):boolean {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
  }

  static get(object:object, field:string):any {
    return get(object, field)
  }
}