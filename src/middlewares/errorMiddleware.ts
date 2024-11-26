import { Request, Response } from 'express'
import { ApiError } from '../errors/ApiError'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response
): void {
  if (error instanceof ApiError) {
    // Custom error handling for API-specific errors
    res.status(500).json(error.toResponseJSON())
  } else {
    // Catch-all for other unexpected errors
    console.error('Unexpected error:', error)
    res.json({ status: 'error', message: 'An unexpected error occurred.' })
  }
}
