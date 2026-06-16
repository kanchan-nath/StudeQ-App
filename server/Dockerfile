FROM node:22-slim

RUN apt-get update && apt-get install -y \
    graphicsmagick \
    ghostscript \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

COPY . .

ENV TRANSFORMERS_CACHE=/app/.cache/transformers

EXPOSE 3000

CMD ["node", "index.js"]