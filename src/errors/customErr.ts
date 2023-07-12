class CustomErr extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const CreateApiErr = (msg: string, code?: number) =>
  new CustomErr(msg, code || 500);
