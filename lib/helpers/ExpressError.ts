type Options = {
  status: number,
  message: string,
  code: string,
}
export default class ExpressError extends Error {
  statusCode: number;
  errorCode: string;
  constructor(options:Options) {
    let { status, message, code } = options;
    if (!message) message = 'Express Error';
    super(message);
    if (!code) code = 'unknown:error';
    if (!status) status = 400;
    if (status < 400 || status > 599) status === 400;
    status = Math.floor(status);
    this.statusCode = status;
    this.errorCode = code;
    this.name = 'ExpressError';
  }
}