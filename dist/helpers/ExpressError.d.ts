type Options = {
    status: number;
    message: string;
    code: string;
};
export default class ExpressError extends Error {
    statusCode: number;
    errorCode: string;
    constructor(options: Options);
}
export {};
