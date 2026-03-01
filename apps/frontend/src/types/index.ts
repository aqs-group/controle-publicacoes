// Shared TypeScript types for the frontend

export interface Item {
  id: string
  nome: string
  codigo: string
  quantidade: number
  estoqueMinimo: number
  categoria: string
  descricao?: string
  criadoEm?: string
  atualizadoEm?: string
}

export interface RemessaItem {
  itemId: string
  quantidade: number
}

export type RemessaStatus = 'pendente' | 'enviado' | 'entregue'

export interface Remessa {
  id: string
  itens: RemessaItem[]
  destinatario: string
  status: RemessaStatus
  rastreamento?: string
  observacoes?: string
  criadoEm?: string
  criadoPor?: string
  enviadoEm?: string
}

export interface Relatorio {
  id: string
  mes: number
  ano: number
  dadosEstoque: {
    total: number
    lowStock: number
    itens: Item[]
  }
  dadosRemessas: {
    total: number
    remessas: Remessa[]
  }
  geradoEm?: string
  geradoPor?: string
}

export interface ApiResponse<T> {
  data: T
  total?: number
  error?: string
}
