import { ApiError, IErrorResponse } from './ApiError'

export class ValidationError extends ApiError {
  errors?: any[] // Make 'errors' optional

  constructor(message: string, errors?: any[], originalError?: any) {
    // 'errors' is now optional
    super(400, 'ValidationError', message, originalError)
    if (errors) {
      this.errors = errors
    }
  }

  // Override to include specific validation error details
  toResponseJSON(): IErrorResponse {
    const response = super.toResponseJSON()
    if (this.errors) {
      response.errors = this.errors // Add the 'errors' field to the response
    }
    return response
  }
}
