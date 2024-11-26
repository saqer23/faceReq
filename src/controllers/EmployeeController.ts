import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/ValidationError'
import EmployeeService from '../services/EmployeeServices'

class EmployeeController {
  public async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const filterData = req.query
      const employees = await EmployeeService.getAllEmployees(filterData)
      res.status(200).json(employees)
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

  public async createEmployee(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body
      const file = req.file
      let filePath = ''
      if (file) {
        filePath =
          'http://localhost:3300' +  '/uploads/' + file?.filename
      }
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const employees = await EmployeeService.createEmployee(data,filePath)
      res.status(201).json(employees)
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

  public async updateEmployee(
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
      const employees = await EmployeeService.updateEmployee(id, data)
      res.status(200).json(employees)
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

  public async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      const deletedEmployeeName = await EmployeeService.deleteEmployee(id)
      res.status(200).json({
        message: `The Employee '${deletedEmployeeName}' has been successfully deleted`,
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

export default new EmployeeController()
