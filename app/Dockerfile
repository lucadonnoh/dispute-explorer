FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_INDEXER_URL
ENV NEXT_PUBLIC_INDEXER_URL=$NEXT_PUBLIC_INDEXER_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
