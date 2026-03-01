import type { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async (_req, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
      env: process.env.NODE_ENV ?? 'development',
    })
  })
}
