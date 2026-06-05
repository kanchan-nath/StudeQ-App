FROM node:22-alpine AS builder

RUN apk add --no-cache \
    graphicsmagick \
    ghostscript \
    python3 \
    make \
    g++

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

ENV TRANSFORMERS_CACHE=/app/.cache/transformers

EXPOSE 4000

CMD ["node", "index.js"]
