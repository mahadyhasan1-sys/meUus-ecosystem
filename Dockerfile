# ─── Stage 1: Build Frontend ─────────────────────────────────────────────────
# Installs ALL deps (incl. devDeps) so Vite can build the React app.
FROM node:20-slim AS builder
WORKDIR /app

# Layer cache: only re-install if package files change
COPY package*.json ./
RUN npm ci

# Copy source and build both frontend (Vite) and server (esbuild)
COPY . .
RUN npm run build

# ─── Stage 2: Production Runtime ─────────────────────────────────────────────
# Slim image with only production deps + prebuilt artifacts.
FROM node:20-slim AS runtime
WORKDIR /app

# Production deps only (no devDeps = smaller image)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy prebuilt assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Firebase Admin reads projectId from this config file at runtime
COPY firebase-applet-config.json ./

# Cloud Run default port — overrideable via environment
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Healthcheck — Cloud Run polls this before routing any traffic to the container.
# A non-200 response from /api/health means the container is not ready.
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "\
    require('http').get(\
      'http://localhost:' + (process.env.PORT || 8080) + '/api/health',\
      function(r) { process.exit(r.statusCode === 200 ? 0 : 1); }\
    ).on('error', function() { process.exit(1); });"

# Runtime secrets are injected by Cloud Run via --set-secrets (Secret Manager).
# Never pass GEMINI_API_KEY, SQL_*, or FIREBASE_* via plain env vars in production.

CMD ["node", "dist/server.cjs"]
