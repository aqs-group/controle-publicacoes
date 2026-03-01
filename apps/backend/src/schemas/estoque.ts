import { z } from 'zod'

export const ItemSchema = z.object({
  nome: z.string().min(1),
  codigo: z.string().min(1),
  quantidade: z.number().int().min(0),
  estoqueMinimo: z.number().int().min(0).default(5),
  categoria: z.string().min(1),
  descricao: z.string().optional(),
})

export const ItemUpdateSchema = ItemSchema.partial()

export type Item = z.infer<typeof ItemSchema>
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>

export interface ItemDoc extends Item {
  id: string
  criadoEm: FirebaseFirestore.Timestamp
  atualizadoEm: FirebaseFirestore.Timestamp
}
