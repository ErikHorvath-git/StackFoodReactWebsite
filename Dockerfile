FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_GOOGLE_MAP_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG GOOGLE_MAP_KEY
ARG GOOGLE_MAP_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAP_KEY=$NEXT_PUBLIC_GOOGLE_MAP_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV GOOGLE_MAP_KEY=$GOOGLE_MAP_KEY
ENV GOOGLE_MAP_API_KEY=$GOOGLE_MAP_API_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
