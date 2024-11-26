// The base class for handling API errors. Other error types should extend this class.

export interface IErrorResponse {
  status: string
  statusCode: number
  message: string
  [key: string]: any // This line allows the addition of extra properties by derived classes.
}

export class ApiError extends Error {
  statusCode: number
  type: string
  originalError?: any

  constructor(
    statusCode: number,
    type: string,
    message: string,
    originalError?: any
  ) {
    super(message)
    this.statusCode = statusCode
    this.type = type
    this.originalError = originalError

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  toResponseJSON(): IErrorResponse {
    return {
      status: 'error',
      statusCode: this.statusCode,
      message: this.message,
      // Ensure no sensitive details are included, especially from `originalError`
    }
  }
}
