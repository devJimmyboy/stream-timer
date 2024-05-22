import dotenv from 'dotenv'
dotenv.config()
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import expressSession from 'express-session'
import { createServer } from 'http'
import express from 'express'
import { db } from './db.js'
import { Server } from 'socket.io'
import passport from 'passport'
import { setupAuth } from './auth.js'
import { setupRoutes } from './routes.js'
import { User as PrismaUser, Timer } from '@prisma/client'
import { CustomizationOptions } from './constants.js'

const app = express()
const server = createServer(app)
const sessionMiddleware = expressSession({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
  },
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(db, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
})
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.static('client/dist'))

const apiRouter = express.Router()
setupAuth(apiRouter)
setupRoutes(apiRouter)
app.use('/api', apiRouter)

const PORT = Number(process.env.PORT || 3000)

const io = new Server(server)
io.engine.use(sessionMiddleware)

io.on('connection', (socket) => {
  socket.on('login', async (data, ack) => {
    const user = await db.user.findFirst({
      where: {
        OR: [
          {
            id: data.user,
          },
          {
            name: data.user,
          },
        ],
      },
      include: {
        timers: true,
      },
    })
    socket.join(user.id)
    ack(user)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
declare global {
  namespace Express {
    interface User extends PrismaUser {
      timers: Timer[]
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: Express.User
  }
}
