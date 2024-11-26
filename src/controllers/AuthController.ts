import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { AuthService } from '../services/AuthServices'

class AuthController {
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }
      await AuthService.login(req, res, next)
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        statusCode: error.statusCode || 500,
        message: error.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Optionally include stack trace in development
        originalError: error.originalError
          ? error.originalError.message
          : undefined,
      })
    }
  }
}

export default new AuthController()
