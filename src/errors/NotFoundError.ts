// src/errors/NotFoundError.ts
import { ApiError } from './ApiError'

export class NotFoundError extends ApiError {
  constructor(message: string, originalError?: any) {
    // 404 is the standard response code for not found resources.
    super(404, 'NotFoundError', message, originalError)
  }
}
