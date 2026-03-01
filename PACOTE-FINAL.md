# PACOTE-FINAL — Blueprint Controle de Publicações

> Documento de referência para o code sprint. Aprovado por Rafael Aquino (CEO).

## Arquitetura

| Camada | Stack | Host |
|--------|-------|------|
| Frontend | Next.js 14 App Router + PWA + Tailwind | Vercel / Firebase Hosting |
| Backend | Fastify 4 + TypeScript | Google Cloud Run |
| Auth | Firebase Authentication | GCP |
| Database | Firestore | GCP |
| Storage | Firebase Storage | GCP |
| CI/CD | GitHub Actions | GitHub |

## Princípios

- **UX scan-first**: interface otimizada para captura rápida via câmera/scan
- **Ledger imutável**: publicações registradas com timestamp e hash SHA256 — nunca editadas, apenas sucedidas
- **Deploy GCP $0.30/mês**: Cloud Run scale-to-zero + Firestore free tier

## Estrutura Monorepo

```
controle-publicacoes/
├── apps/
│   ├── web/          # Next.js PWA
│   └── api/          # Fastify Cloud Run
├── packages/
│   └── shared/       # Types + utils compartilhados
├── docker-compose.yml
├── firebase.json
└── turbo.json
```

## Roadmap Sprint 1

- [ ] Auth flow (Firebase Auth + middleware Fastify)
- [ ] CRUD publicações com ledger imutável
- [ ] Upload imagem (Firebase Storage)
- [ ] PWA manifest + offline support
- [ ] Deploy Cloud Run (Terraform ou gcloud CLI)

---
_Renato (CTO) — 2026-03-01_
