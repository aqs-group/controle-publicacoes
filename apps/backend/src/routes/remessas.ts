import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from '../lib/firebase.js'
import { RemessaSchema, RemessaUpdateSchema } from '../schemas/remessas.js'

export async function remessasRoutes(app: FastifyInstance): Promise<void> {
  const COLLECTION = 'remessas'

  // GET /remessas — list all
  app.get('/remessas', async (req: FastifyRequest<{ Querystring: { status?: string } }>, reply: FastifyReply) => {
    const db = getDb()
    let query = db.collection(COLLECTION).orderBy('criadoEm', 'desc') as FirebaseFirestore.Query
    if (req.query.status) {
      query = query.where('status', '==', req.query.status)
    }
    const snapshot = await query.get()
    const remessas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return reply.send({ data: remessas, total: remessas.length })
  })

  // GET /remessas/:id — single
  app.get('/remessas/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const db = getDb()
    const doc = await db.collection(COLLECTION).doc(req.params.id).get()
    if (!doc.exists) return reply.status(404).send({ error: 'Remessa não encontrada' })
    return reply.send({ data: { id: doc.id, ...doc.data() } })
  })

  // POST /remessas — create
  app.post('/remessas', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = RemessaSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.format() })

    const db = getDb()
    const now = FieldValue.serverTimestamp()
    const docRef = await db.collection(COLLECTION).add({
      ...parsed.data,
      status: 'pendente',
      criadoEm: now,
      criadoPor: (req as any).user?.uid ?? 'system',
    })
    return reply.status(201).send({ data: { id: docRef.id, ...parsed.data, status: 'pendente' } })
  })

  // PATCH /remessas/:id — update status / tracking
  app.patch('/remessas/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const parsed = RemessaUpdateSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.format() })

    const db = getDb()
    const docRef = db.collection(COLLECTION).doc(req.params.id)
    const doc = await docRef.get()
    if (!doc.exists) return reply.status(404).send({ error: 'Remessa não encontrada' })

    const update: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.status === 'enviado') {
      update.enviadoEm = FieldValue.serverTimestamp()
    }

    await docRef.update(update)
    return reply.send({ data: { id: req.params.id, ...doc.data(), ...parsed.data } })
  })
}
