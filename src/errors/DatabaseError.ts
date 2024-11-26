import { ApiError } from './ApiError'

export class DatabaseError extends ApiError {
  // Additional properties if needed for more context

  constructor(message: string, originalError?: any) {
    super(500, 'DatabaseError', message, originalError)
    // You can log the `originalError` here or in centralized error handling middleware
  }

  // If needed, override `toResponseJSON` to customize the response for database errors
}
