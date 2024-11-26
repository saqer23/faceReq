import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { prisma } from './utility/prisma'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'

// Configure dotenv to load .env file
dotenv.config()

console.log('Initializing passport strategies...')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        console.log('username:', username, 'password:', password)

        const user = await prisma.user.findFirst({ where: { username } })

        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password.',
          })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return done(null, false, {
            message: 'Incorrect username or password.',
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export const generateToken = (user: any): string => {
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '7d',
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(
  submittedPassword: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(submittedPassword, storedHash)
}
