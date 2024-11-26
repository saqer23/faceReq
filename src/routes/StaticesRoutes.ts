import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import StaticesControllers from '../controllers/StaticesController'

const Routes = Router()

Routes.get(
  '/',
  StaticesControllers.getAllStatices
)

export default Routes