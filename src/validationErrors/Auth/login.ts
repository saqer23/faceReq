import { body } from 'express-validator'
const validation = [
  body('username')
    .isLength({ min: 3 })
    .isString()
    .withMessage('username must be at least 3 characters long'),
  body('password')
    .isLength({ min: 3 })
    .isString()
    .withMessage('password must be at least 3 characters long'),
]
export default validation
