'use client'

import Link from 'next/link'

const statusMap: Record<string, { label: string; class: string }> = {
  pendente: { label: 'Pendente', class: 'badge-warning' },
  enviado: { label: 'Enviado', class: 'badge bg-blue-100 text-blue-700' },
  entregue: { label: 'Entregue', class: 'badge-success' },
}

const mockRemessas = [
  { id: 'r1', destinatario: 'Congregação Norte', status: 'enviado', criadoEm: '2025-03-01', itens: 3 },
  { id: 'r2', destinatario: 'Congregação Sul', status: 'pendente', criadoEm: '2025-03-02', itens: 5 },
  { id: 'r3', destinatario: 'Congregação Leste', status: 'entregue', criadoEm: '2025-02-20', itens: 2 },
]

export default function RemessasPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-brand-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white">← Início</Link>
          <h1 className="text-xl font-bold">🚚 Remessas</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <div className="space-y-3">
          {mockRemessas.map((r) => {
            const status = statusMap[r.status]
            return (
              <div key={r.id} className="card flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{r.destinatario}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{r.itens} item(s) · {r.criadoEm}</p>
                </div>
                <span className={status.class}>{status.label}</span>
              </div>
            )
          })}
        </div>

        <button className="btn-primary w-full">+ Nova Remessa</button>
      </div>
    </main>
  )
}
