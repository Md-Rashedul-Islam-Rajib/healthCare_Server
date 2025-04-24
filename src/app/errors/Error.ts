export class ClassifiedError extends Error {
  statusCode: number;
  status: string;
//   stack: string;

  constructor(
    message: string,
    statusCode: number,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      if(stack){
        this.stack = stack;
      }else{
    Error.captureStackTrace(this, this.constructor);
  }
      }
}