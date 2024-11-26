import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/ValidationError'
import UserService from '../services/UserServices'

class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const filterData = req.query
      const users = await UserService.getAllUsers(filterData)
      res.status(200).json(users)
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

  public async createUser(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body
      const users = await UserService.createUser(data)
      res.status(201).json(users)
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

  public async updateUser(
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
      const users = await UserService.updateUser(id, data)
      res.status(200).json(users)
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

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      const deletedUserName = await UserService.deleteUser(id)
      res.status(200).json({
        message: `The User '${deletedUserName}' has been successfully deleted`,
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

export default new UserController()
