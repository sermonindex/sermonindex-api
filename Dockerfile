FROM node:20-slim AS builder
USER node
WORKDIR /home/node/
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node package*.json ./
COPY --chown=node:node nest-cli.json ./
COPY --chown=node:node ./prisma/schema ./prisma/schema
COPY --chown=node:node ./src ./src
RUN npm ci

FROM builder AS prod

RUN  npx prisma generate \
    && npm run build \
    && npm install --omit=dev --omit=optional

FROM node:20-slim
RUN apt-get update && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /home/node

COPY --from=prod /home/node/dist .
COPY --from=prod /home/node/node_modules node_modules
EXPOSE 3000
ENTRYPOINT ["node", "main.js"]