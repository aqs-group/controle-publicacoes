import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from '../lib/firebase.js'
import { ItemSchema, ItemUpdateSchema } from '../schemas/estoque.js'

export async function estoqueRoutes(app: FastifyInstance): Promise<void> {
  const COLLECTION = 'itens'

  // GET /estoque — list all items
  app.get('/estoque', async (_req: FastifyRequest, reply: FastifyReply) => {
    const db = getDb()
    const snapshot = await db.collection(COLLECTION).orderBy('nome').get()
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return reply.send({ data: items, total: items.length })
  })

  // GET /estoque/low-stock — items below minimum stock
  app.get('/estoque/low-stock', async (_req: FastifyRequest, reply: FastifyReply) => {
    const db = getDb()
    const snapshot = await db.collection(COLLECTION).get()
    const lowStock = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item: any) => item.quantidade <= item.estoqueMinimo)
    return reply.send({ data: lowStock, total: lowStock.length })
  })

  // GET /estoque/:id — get single item
  app.get('/estoque/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const db = getDb()
    const doc = await db.collection(COLLECTION).doc(req.params.id).get()
    if (!doc.exists) return reply.status(404).send({ error: 'Item não encontrado' })
    return reply.send({ data: { id: doc.id, ...doc.data() } })
  })

  // GET /estoque/barcode/:codigo — find by barcode/QR
  app.get('/estoque/barcode/:codigo', async (req: FastifyRequest<{ Params: { codigo: string } }>, reply: FastifyReply) => {
    const db = getDb()
    const snapshot = await db.collection(COLLECTION).where('codigo', '==', req.params.codigo).limit(1).get()
    if (snapshot.empty) return reply.status(404).send({ error: 'Item não encontrado para este código' })
    const doc = snapshot.docs[0]
    return reply.send({ data: { id: doc.id, ...doc.data() } })
  })

  // POST /estoque — create item
  app.post('/estoque', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = ItemSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.format() })

    const db = getDb()
    const now = FieldValue.serverTimestamp()
    const docRef = await db.collection(COLLECTION).add({
      ...parsed.data,
      criadoEm: now,
      atualizadoEm: now,
    })
    return reply.status(201).send({ data: { id: docRef.id, ...parsed.data } })
  })

  // PATCH /estoque/:id — update item
  app.patch('/estoque/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const parsed = ItemUpdateSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.format() })

    const db = getDb()
    const docRef = db.collection(COLLECTION).doc(req.params.id)
    const doc = await docRef.get()
    if (!doc.exists) return reply.status(404).send({ error: 'Item não encontrado' })

    await docRef.update({ ...parsed.data, atualizadoEm: FieldValue.serverTimestamp() })
    return reply.send({ data: { id: req.params.id, ...doc.data(), ...parsed.data } })
  })

  // DELETE /estoque/:id — delete item
  app.delete('/estoque/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const db = getDb()
    const docRef = db.collection(COLLECTION).doc(req.params.id)
    const doc = await docRef.get()
    if (!doc.exists) return reply.status(404).send({ error: 'Item não encontrado' })
    await docRef.delete()
    return reply.status(204).send()
  })
}
