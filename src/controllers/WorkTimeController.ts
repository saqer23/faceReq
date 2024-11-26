import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/ValidationError'
import WorkTimeService from '../services/WorkTimeServices'

class WorkTimeController {
  public async getAllWorkTimes(req: Request, res: Response): Promise<void> {
    try {
      const filterData = req.query
      const workTimes = await WorkTimeService.getAllWorkTimes(filterData)
      res.status(200).json(workTimes)
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

  public async createWorkTime(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body
      const workTimes = await WorkTimeService.createWorkTime(data)
      res.status(201).json(workTimes)
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

  public async updateWorkTime(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id
      const data = req.body
      
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const workTimes = await WorkTimeService.updateWorkTime(id, data)
      res.status(200).json(workTimes)
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

  public async deleteWorkTime(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      const deletedWorkTimeName = await WorkTimeService.deleteWorkTime(id)
      res.status(200).json({
        message: `The WorkTime '${deletedWorkTimeName}' has been successfully deleted`,
      })
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

export default new WorkTimeController()
