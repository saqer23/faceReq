import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/ValidationError'
import StaticesService from '../services/StaticesServices'

class StaticesController {
  public async getAllStatices(req: Request, res: Response): Promise<void> {
    try {
      const Statices = await StaticesService.getAllStatices()
      res.status(200).json(Statices)
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

export default new StaticesController()
