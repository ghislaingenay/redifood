FROM node:16-alpine AS base

FROM base as builder
WORKDIR /usr/src/app
COPY package*.json ./
ENV ENVIRONMENT=production
RUN npm install
COPY . .
RUN npm run build

FROM base
WORKDIR /usr/src/app
ENV ENVIRONMENT=production
COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/package.json .
EXPOSE 3000
CMD ["node", "dist/src/main.js"]

