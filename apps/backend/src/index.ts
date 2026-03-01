import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { initFirebase } from './lib/firebase.js'
import { healthRoutes } from './routes/health.js'
import { estoqueRoutes } from './routes/estoque.js'
import { remessasRoutes } from './routes/remessas.js'
import { relatoriosRoutes } from './routes/relatorios.js'

const PORT = parseInt(process.env.BACKEND_PORT ?? '3001', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

async function main(): Promise<void> {
  // Initialize Firebase
  initFirebase()

  // Create Fastify instance
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  })

  // Register plugins
  await app.register(helmet, {
    contentSecurityPolicy: false, // Adjust for your needs
  })
  await app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  })

  // Register routes
  await app.register(healthRoutes)
  await app.register(estoqueRoutes, { prefix: '/api/v1' })
  await app.register(remessasRoutes, { prefix: '/api/v1' })
  await app.register(relatoriosRoutes, { prefix: '/api/v1' })

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error)
    reply.status(error.statusCode ?? 500).send({
      error: error.message ?? 'Internal Server Error',
      statusCode: error.statusCode ?? 500,
    })
  })

  // Start
  try {
    await app.listen({ port: PORT, host: HOST })
    app.log.info(`🚀 Backend running at http://${HOST}:${PORT}`)
    app.log.info(`📊 Health: http://${HOST}:${PORT}/health`)
    app.log.info(`📦 Estoque: http://${HOST}:${PORT}/api/v1/estoque`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
