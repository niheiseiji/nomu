FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json ./web/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules

# Copy source code
COPY web ./web

# Build
WORKDIR /app/web
RUN pnpm build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy built files
COPY --from=builder /app/web/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
