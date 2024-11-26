import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import WorkTimeControllers from '../controllers/WorkTimeController'

const Routes = Router()

Routes.get(
  '/',
  isAuthenticated,
  WorkTimeControllers.getAllWorkTimes
)
Routes.post(
  '/',
  WorkTimeControllers.createWorkTime
)
Routes.patch(
  '/:id',
  isAuthenticated,
  WorkTimeControllers.updateWorkTime
)
Routes.delete(
  '/:id',
  isAuthenticated,
  WorkTimeControllers.deleteWorkTime
)

export default Routes