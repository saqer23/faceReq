import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import UserControllers from '../controllers/UserController'

const Routes = Router()

Routes.get(
  '/',
  isAuthenticated,
  UserControllers.getAllUsers
)
Routes.post(
  '/',
  UserControllers.createUser
)
Routes.patch(
  '/:id',
  isAuthenticated,
  UserControllers.updateUser
)
Routes.delete(
  '/:id',
  isAuthenticated,
  UserControllers.deleteUser
)

export default Routes