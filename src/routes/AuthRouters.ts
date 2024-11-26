import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import login from '../validationErrors/Auth/login'
const AuthRoutes = Router()

AuthRoutes.post('/login', login, AuthController.login)
export default AuthRoutes
