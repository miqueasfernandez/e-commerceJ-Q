import { body } from 'express-validator';

export const registerValidation = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must only contain letters'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('Last name must only contain letters'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Username must be alphanumeric without special characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];


