FROM node:16-alpine AS base

#Remove scripting like husky
# RUN npm pkg set scripts.scriptname="cmd" 

FROM base as builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install --force
RUN npm ci
ENV NEXT_TELEMETRY_DISABLED 1
COPY . .
RUN npm run build 

#if something inside deployment folder
# COPY deployment/.env.${NODE_ENV} .env

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]