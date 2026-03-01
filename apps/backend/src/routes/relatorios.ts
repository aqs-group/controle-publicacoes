import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from '../lib/firebase.js'

export async function relatoriosRoutes(app: FastifyInstance): Promise<void> {
  const COLLECTION = 'relatorios'

  // GET /relatorios — list reports
  app.get('/relatorios', async (_req: FastifyRequest, reply: FastifyReply) => {
    const db = getDb()
    const snapshot = await db.collection(COLLECTION).orderBy('ano', 'desc').orderBy('mes', 'desc').get()
    const relatorios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return reply.send({ data: relatorios, total: relatorios.length })
  })

  // POST /relatorios/gerar — generate monthly report snapshot
  app.post(
    '/relatorios/gerar',
    async (
      req: FastifyRequest<{ Body: { mes: number; ano: number } }>,
      reply: FastifyReply
    ) => {
      const { mes, ano } = req.body

      if (!mes || !ano || mes < 1 || mes > 12) {
        return reply.status(400).send({ error: 'Parâmetros inválidos: mes (1-12) e ano são obrigatórios' })
      }

      const db = getDb()

      // Aggregate stock data
      const itensSnap = await db.collection('itens').get()
      const dadosEstoque = {
        total: itensSnap.size,
        itens: itensSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        lowStock: itensSnap.docs
          .map((d) => d.data())
          .filter((i) => i.quantidade <= i.estoqueMinimo).length,
      }

      // Aggregate remessas data for the month (simplified)
      const remessasSnap = await db
        .collection('remessas')
        .where('status', '==', 'entregue')
        .get()
      const dadosRemessas = {
        total: remessasSnap.size,
        remessas: remessasSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      }

      const docRef = await db.collection(COLLECTION).add({
        mes,
        ano,
        dadosEstoque,
        dadosRemessas,
        geradoEm: FieldValue.serverTimestamp(),
        geradoPor: (req as any).user?.uid ?? 'system',
      })

      return reply.status(201).send({
        data: { id: docRef.id, mes, ano, dadosEstoque, dadosRemessas },
      })
    }
  )

  // GET /relatorios/:id — get specific report
  app.get('/relatorios/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const db = getDb()
    const doc = await db.collection(COLLECTION).doc(req.params.id).get()
    if (!doc.exists) return reply.status(404).send({ error: 'Relatório não encontrado' })
    return reply.send({ data: { id: doc.id, ...doc.data() } })
  })
}
