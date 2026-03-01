# Multi-stage build for Fastify backend
FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV BACKEND_PORT=3001

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3001

# Cloud Run needs a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify
USER fastify

CMD ["node", "dist/index.js"]
