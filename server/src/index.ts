import * as dotenv from 'dotenv'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { ApplicationDatabase } from './database/database'
import { BotManager } from './services/bot.manager'
import { BotService } from './services/bot.service'
import { UserService } from './services/user.service'
import { BotController } from './controllers/bot.controller'
import { UserController } from './controllers/user.controller'
import { Router } from './router/router'

dotenv.config({ path: __dirname + `/config/.env.${process.env.NODE_ENV}` })
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000
console.log(process.env.PORT)
const connectionString = process.env.DATABASE_URL ?? ''
const fastify = Fastify({ logger: true })

const database = new ApplicationDatabase(connectionString)

const botManager = new BotManager(database, fastify)
const botService = new BotService(database, botManager)
const userService = new UserService(database, botManager)

const botController = new BotController(botService)
const userController = new UserController(userService)
const router = new Router(fastify, userController, botController)

;(async () => {
   await fastify.register(cors, {
      origin: true,
      credentials: true
   })
   await database.migrate()
   router.init()
   fastify.listen({ port: PORT, host: '0.0.0.0' }, async (err: any) => {
      if (err) {
         fastify.log.error(err)
         process.exit(1)
      }
      console.log(`Server started on port ${PORT}`)
      await botManager.loadBots()
   })
})()

process.on('SIGTERM', async () => {
   await botManager.destroyBots()
   await database.destroy()
   process.exit(0)
})
