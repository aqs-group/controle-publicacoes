'use client'

import Link from 'next/link'

const mockRelatorios = [
  { id: 'rel1', mes: 2, ano: 2025, geradoEm: '2025-03-01' },
  { id: 'rel2', mes: 1, ano: 2025, geradoEm: '2025-02-01' },
]

const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function RelatoriosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-brand-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white">← Início</Link>
          <h1 className="text-xl font-bold">📊 Relatórios</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <div className="space-y-3">
          {mockRelatorios.map((r) => (
            <div key={r.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{meses[r.mes]} {r.ano}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Gerado em {r.geradoEm}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs py-1.5 px-3">PDF</button>
                <button className="btn-secondary text-xs py-1.5 px-3">Excel</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary w-full">+ Gerar Relatório</button>
      </div>
    </main>
  )
}
