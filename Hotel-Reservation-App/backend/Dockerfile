FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN npx tsup src/server.ts --format esm --platform node --out-dir /app/bundle

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/bundle/server.js ./dist/server.js

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
