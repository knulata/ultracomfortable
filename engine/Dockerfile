FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npx tsc
RUN npm prune --production
CMD ["node", "dist/index.js"]
