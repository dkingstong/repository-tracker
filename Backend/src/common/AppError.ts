export default class AppError extends Error {
  statusCode: number
  message: string

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
  }
  public static InternalServerError(message: string): AppError {
    return new AppError(500, message)
  }

  public static BadRequest(message: string): AppError {
    return new AppError(400, message)
  }

  public static Unauthorized(message: string): AppError {
    return new AppError(401, message)
  }

  public static NotFound(message: string): AppError {
    return new AppError(404, message)
  }

  public static AuthError(message: string): AppError {
    return new AppError(401, message)
  }

  public static ValidationError(message: string): AppError {
    return new AppError(422, message)
  }
}
