import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import PreparedControllers from '../controllers/PreparedController'

const Routes = Router()

Routes.get(
  '/',
  isAuthenticated,
  PreparedControllers.getAllPrepared
)
Routes.post(
  '/',
  PreparedControllers.createPrepared
)

export default Routes