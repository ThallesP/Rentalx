export class AppException {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {}
}
