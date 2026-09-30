FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 42069
CMD ["node_modules/.bin/ponder", "start"]
