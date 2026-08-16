# ── Build Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

# ── Production Stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist-server/index.js"]
