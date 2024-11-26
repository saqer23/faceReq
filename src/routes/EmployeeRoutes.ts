import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import EmployeeControllers from '../controllers/EmployeeController'
import upload from '../middlewares/uploadMiddleware'

const Routes = Router()

Routes.get(
  '/',
  isAuthenticated,
  EmployeeControllers.getAllEmployees
)
Routes.post(
  '/',
  upload.single('file'),
  EmployeeControllers.createEmployee
)
Routes.patch(
  '/:id',
  isAuthenticated,
  EmployeeControllers.updateEmployee
)
Routes.delete(
  '/:id',
  isAuthenticated,
  EmployeeControllers.deleteEmployee
)

export default Routes