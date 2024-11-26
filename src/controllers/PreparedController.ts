import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/ValidationError'
import PreparedService from '../services/PreparedServices'

class PreparedController {
  public async getAllPrepared(req: Request, res: Response): Promise<void> {
    try {
      const filterData = req.query
      const prepared = await PreparedService.getAllPrepared(filterData)
      res.status(200).json(prepared)
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

  public async createPrepared(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body
      const prepared = await PreparedService.createPrepared(data)
      res.status(201).json(prepared)
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

export default new PreparedController()
