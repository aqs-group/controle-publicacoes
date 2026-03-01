'use client'

import { useState } from 'react'
import Link from 'next/link'

// Placeholder until API integration
const mockItems = [
  { id: '1', nome: 'Bíblia Sagrada', codigo: '978-0-00-000001-0', quantidade: 12, estoqueMinimo: 5, categoria: 'Bíblia' },
  { id: '2', nome: 'Cantai com Louvor', codigo: '978-0-00-000002-0', quantidade: 3, estoqueMinimo: 5, categoria: 'Hinário' },
  { id: '3', nome: 'O Que a Bíblia Ensina', codigo: '978-0-00-000003-0', quantidade: 25, estoqueMinimo: 10, categoria: 'Livro' },
]

export default function EstoquePage() {
  const [search, setSearch] = useState('')
  const filtered = mockItems.filter((i) =>
    i.nome.toLowerCase().includes(search.toLowerCase()) ||
    i.codigo.includes(search)
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-brand-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white">← Início</Link>
          <h1 className="text-xl font-bold">📦 Estoque</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Search + Scanner */}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/scanner" className="btn-secondary px-3">📷</Link>
        </div>

        {/* Low stock alert */}
        {filtered.some((i) => i.quantidade <= i.estoqueMinimo) && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ⚠️ <strong>{filtered.filter((i) => i.quantidade <= i.estoqueMinimo).length}</strong> item(s) com estoque baixo.
          </div>
        )}

        {/* Item list */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const lowStock = item.quantidade <= item.estoqueMinimo
            return (
              <div key={item.id} className={`card ${lowStock ? 'border-red-200 bg-red-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.nome}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.codigo} · {item.categoria}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.quantidade}
                    </span>
                    <p className="text-xs text-gray-400">mín. {item.estoqueMinimo}</p>
                  </div>
                </div>
                {lowStock && (
                  <p className="mt-2 text-xs text-red-600 font-medium">🔴 Estoque baixo</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Add button */}
        <button className="btn-primary w-full">+ Novo Item</button>
      </div>
    </main>
  )
}
