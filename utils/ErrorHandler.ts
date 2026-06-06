
export class CustomError extends Error {
  status: number;
  location: string;

  constructor(message: string, status: number, location = "") {
    super(message);
    this.status = status;
    this.location = location;
    // this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
  }
}
