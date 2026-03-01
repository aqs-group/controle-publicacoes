import Link from 'next/link'

const modules = [
  {
    href: '/estoque',
    icon: '📦',
    title: 'Estoque',
    description: 'Gerencie publicações, alertas de low stock e escaneie etiquetas.',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    href: '/remessas',
    icon: '🚚',
    title: 'Remessas',
    description: 'Crie e acompanhe remessas de publicações.',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
  },
  {
    href: '/relatorios',
    icon: '📊',
    title: 'Relatórios',
    description: 'Exporte relatórios mensais em PDF e Excel.',
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
  },
  {
    href: '/scanner',
    icon: '📷',
    title: 'Scanner',
    description: 'Leia QR Code ou Barcode via câmera do dispositivo.',
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-6">
          <h1 className="text-2xl font-bold">📖 Controle de Publicações</h1>
          <p className="mt-1 text-blue-100 text-sm">Sistema interno — Salão do Reino</p>
        </div>
      </header>

      {/* Main grid */}
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`card border ${mod.color} hover:shadow-md transition-shadow flex flex-col gap-3`}
            >
              <div className={`w-12 h-12 rounded-xl ${mod.iconBg} flex items-center justify-center text-2xl`}>
                {mod.icon}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{mod.title}</h2>
                <p className="text-sm text-gray-600 mt-0.5">{mod.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          aQs Group © {new Date().getFullYear()} · v0.1.0
        </p>
      </div>
    </main>
  )
}
