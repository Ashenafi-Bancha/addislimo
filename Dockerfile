# Production image for the Addis Limo frontend.
#
# Builds the Vite app, then ships only the built files and a zero-dependency
# Node server (server.mjs). The final image has no node_modules and no source.
#
# Host contract: listens on $PORT (default 8080), bound to 0.0.0.0.
#
#   docker build -t addislimo .
#   docker run -p 8080:8080 addislimo

# ── Build ──
FROM node:22-alpine AS build
WORKDIR /app

# pnpm version comes from "packageManager" in package.json.
RUN corepack enable

# Dependency manifests first, so the install layer is cached between builds
# that only change source.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Run ──
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080

COPY --from=build /app/dist ./dist
COPY server.mjs package.json ./

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" || exit 1

CMD ["node", "server.mjs"]
