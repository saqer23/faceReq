import { body } from 'express-validator'
const validation = [
  body('startContract')
    .optional({ checkFalsy: true })
    .isLength({ min: 5 })
    .isString()
    .withMessage('startContract must be at least 5 characters long'),
  body('period')
    .optional({ checkFalsy: true })
    .custom((value) => {
      return Number.isInteger(value)
    })
    .withMessage('period must be an integer.')
    .isInt()
    .withMessage('period must be a valid integer.'),
  body('beneficiaryId')
    .optional({ checkFalsy: true })
    .custom((value) => {
      return Number.isInteger(value)
    })
    .withMessage('beneficiaryId must be an integer.')
    .isInt()
    .withMessage('beneficiaryId must be a valid integer.'),
  body('providerId')
    .optional({ checkFalsy: true })
    .custom((value) => {
      return Number.isInteger(value)
    })
    .withMessage('providerId must be an integer.')
    .isInt()
    .withMessage('providerId must be a valid integer.'),
]
export default validation
