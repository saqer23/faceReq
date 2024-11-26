import { Router } from 'express'
import EmployeeRoutes from './EmployeeRoutes'
import UserRoutes from './UserRoutes'
import AuthRoutes from './AuthRouters'
import WorkTimeRoutes from './WorkTimeRoutes'
import PreparedRoutes from './PreparedRoutes'
import StaticesRoutes from './StaticesRoutes'

const rootRouter = Router()
rootRouter.use('/User', UserRoutes)
rootRouter.use('/Employee', EmployeeRoutes)
rootRouter.use('/Auth', AuthRoutes)
rootRouter.use('/WorkTime', WorkTimeRoutes)
rootRouter.use('/Prepared', PreparedRoutes)
rootRouter.use('/Statices', StaticesRoutes)

export default rootRouter