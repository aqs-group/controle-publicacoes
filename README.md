# 📖 Controle de Publicações — aQs Group

> Sistema completo de gestão de publicações para o Salão do Reino.  
> Interno, operacional, sem escopo LGPD.

[![Deploy Status](https://img.shields.io/badge/deploy-Cloud%20Run-4285F4?logo=google-cloud)](https://cloud.google.com/run)
[![Stack](https://img.shields.io/badge/stack-Next.js%2014%20%7C%20Fastify%20%7C%20Firestore-000?logo=vercel)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Descrição

Sistema de controle interno para gerenciar o fluxo completo de publicações:
estoque, remessas, relatórios mensais e leitura automática de etiquetas via câmera.

---

## ✨ Features

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Estoque** | Cadastro de itens, alertas de low stock, histórico | 🚧 Em construção |
| **Remessas** | Envio, rastreamento, status de entrega | 🚧 Em construção |
| **Relatórios** | Export mensal em PDF e Excel | 🚧 Em construção |
| **Scanner** | Leitura de Barcode/QR Code via câmera (PWA) | 🚧 Em construção |
| **Offline** | Sync offline-first com PouchDB | 📋 Planejado |

---

## 🏗️ Arquitetura High-Level

```
┌─────────────────────────────────────────────────────────────┐
│                        PWA (Next.js 14)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Estoque  │  │ Remessas │  │Relatórios│  │  Scanner   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       └─────────────┴─────────────┴───────────────┘         │
│                    Service Layer / PouchDB                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (HTTPS)
┌───────────────────────────▼─────────────────────────────────┐
│               Backend (Fastify + TypeScript)                  │
│               Google Cloud Run (auto-scaling)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: /estoque  /remessas  /relatorios  /auth     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Firebase (Google Cloud)                    │
│  ┌─────────────────┐         ┌──────────────────────────┐   │
│  │    Firestore     │         │     Firebase Auth         │   │
│  │  (NoSQL DB)      │         │  Google OAuth + Email    │   │
│  └─────────────────┘         └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack

### Frontend (`apps/frontend`)
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Next.js | 14.x | Framework React + App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| ZXing | latest | Barcode/QR scanner via câmera |
| PouchDB | 9.x | Offline sync |
| next-pwa | latest | Service Worker / PWA |

### Backend (`apps/backend`)
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Node.js | 20.x LTS | Runtime |
| Fastify | 4.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Firebase Admin SDK | latest | Firestore + Auth server-side |
| Zod | 3.x | Schema validation |

### Infra
| Serviço | Uso |
|---------|-----|
| Google Cloud Run | Deploy do backend (serverless) |
| Firebase Firestore | Banco de dados NoSQL |
| Firebase Auth | Autenticação (Google OAuth + Email) |
| Docker | Local dev + container build |
| pnpm workspaces | Monorepo management |

---

## 📁 Estrutura do Monorepo

```
controle-publicacoes/
├── README.md
├── .gitignore
├── .env.example
├── pnpm-workspace.yaml       # Monorepo workspaces
├── turbo.json                # Turborepo build pipeline
├── package.json              # Root package
├── docker-compose.yml        # Firestore emulator local dev
├── firebase.json             # Firebase deploy config
├── apps/
│   ├── frontend/             # Next.js 14 PWA
│   │   ├── src/
│   │   │   ├── app/          # App Router
│   │   │   │   ├── (auth)/   # Login / OAuth
│   │   │   │   ├── estoque/  # Módulo estoque
│   │   │   │   ├── remessas/ # Módulo remessas
│   │   │   │   ├── relatorios/ # Relatórios
│   │   │   │   └── scanner/  # QR/Barcode scanner
│   │   │   ├── components/   # React components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── lib/          # Utils, Firebase client
│   │   │   └── types/        # TypeScript types shared
│   │   ├── public/
│   │   │   └── manifest.json # PWA manifest
│   │   └── package.json
│   └── backend/              # Fastify REST API
│       ├── src/
│       │   ├── routes/       # Fastify routes
│       │   │   ├── estoque.ts
│       │   │   ├── remessas.ts
│       │   │   ├── relatorios.ts
│       │   │   └── health.ts
│       │   ├── services/     # Business logic
│       │   ├── schemas/      # Zod schemas
│       │   ├── lib/          # Firestore, Auth
│       │   └── index.ts      # Entry point
│       ├── Dockerfile
│       └── package.json
└── packages/
    └── ui/                   # Shared Tailwind components
        ├── src/
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   └── index.ts
        └── package.json
```

---

## 🗄️ Modelo de Dados (Firestore)

### Coleções

```
/itens/{itemId}
  - nome: string
  - codigo: string (barcode/QR)
  - quantidade: number
  - estoqueMinimo: number
  - categoria: string
  - descricao?: string
  - criadoEm: timestamp
  - atualizadoEm: timestamp

/remessas/{remessaId}
  - itens: Array<{ itemId, quantidade }>
  - destinatario: string
  - status: 'pendente' | 'enviado' | 'entregue'
  - rastreamento?: string
  - enviadoEm?: timestamp
  - criadoEm: timestamp
  - criadoPor: string (userId)

/relatorios/{relatorioId}
  - mes: number
  - ano: number
  - dadosEstoque: object
  - dadosRemessas: object
  - geradoEm: timestamp
  - geradoPor: string
```

---

## 🚀 Setup & Desenvolvimento

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Firebase CLI (`npm i -g firebase-tools`)
- Conta Google Cloud com projeto Firebase

### 1. Clone

```bash
git clone https://github.com/aqs-group/controle-publicacoes.git
cd controle-publicacoes
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas configs Firebase
```

Variáveis necessárias (ver `.env.example`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_ADMIN_SERVICE_ACCOUNT` (JSON path ou base64)
- `BACKEND_URL`

### 4. Iniciar Firestore Emulator (dev local)

```bash
docker-compose up -d
# ou
firebase emulators:start --only firestore,auth
```

### 5. Rodar em desenvolvimento

```bash
# Todos os apps (requer turbo)
pnpm dev

# Apenas frontend
pnpm --filter frontend dev

# Apenas backend
pnpm --filter backend dev
```

### 6. Build

```bash
pnpm build
```

---

## 🔧 Firebase Config

```bash
# Login
firebase login

# Selecionar projeto
firebase use <project-id>

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy backend (via Cloud Run - ver CI/CD)
```

---

## 📱 PWA / Scanner

O frontend é uma PWA offline-first. Para testar o scanner de câmera:
- Acesse via HTTPS (obrigatório para câmera)
- Ou use `localhost` (permitido por navegadores)
- Permita acesso à câmera quando solicitado

---

## 📋 TODOs

### Sprint 1 — Fundação
- [x] Scaffold monorepo
- [x] README + docs
- [ ] Firebase project setup
- [ ] Firestore rules
- [ ] Firebase Auth (Google + Email)
- [ ] CI/CD pipeline (GitHub Actions)

### Sprint 2 — Estoque
- [ ] CRUD de itens
- [ ] Scanner de barcode/QR (ZXing)
- [ ] Low stock alerts
- [ ] UI Estoque (lista + cadastro)

### Sprint 3 — Remessas
- [ ] Criação de remessas
- [ ] Status tracking
- [ ] UI Remessas

### Sprint 4 — Relatórios
- [ ] Geração PDF (react-pdf ou pdfmake)
- [ ] Export Excel (xlsx)
- [ ] UI Relatórios mensais

### Sprint 5 — Offline & Polish
- [ ] PouchDB sync offline
- [ ] Service Worker completo
- [ ] Testes E2E (Playwright)
- [ ] Deploy Cloud Run prod

---

## 👥 Time

| Papel | Responsável |
|-------|-------------|
| Product Owner | Rafael Aquino |
| Dev Lead | Renato (CTO aQs Group) |
| DevOps | Gui |
| QA | Henrique |

---

## 📄 Licença

MIT © aQs Group
