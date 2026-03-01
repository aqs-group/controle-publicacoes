import { z } from 'zod'

export const RemessaItemSchema = z.object({
  itemId: z.string(),
  quantidade: z.number().int().min(1),
})

export const RemessaSchema = z.object({
  itens: z.array(RemessaItemSchema).min(1),
  destinatario: z.string().min(1),
  rastreamento: z.string().optional(),
  observacoes: z.string().optional(),
})

export const RemessaUpdateSchema = z.object({
  status: z.enum(['pendente', 'enviado', 'entregue']).optional(),
  rastreamento: z.string().optional(),
  observacoes: z.string().optional(),
})

export type Remessa = z.infer<typeof RemessaSchema>
export type RemessaUpdate = z.infer<typeof RemessaUpdateSchema>

export interface RemessaDoc extends Remessa {
  id: string
  status: 'pendente' | 'enviado' | 'entregue'
  criadoEm: FirebaseFirestore.Timestamp
  criadoPor: string
  enviadoEm?: FirebaseFirestore.Timestamp
}
