FROM node:20-alpine
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@latest --activate

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN pnpm run build

# For now, workers is coupled with the app, but this should be separated when time comes to scale
CMD ["sh", "-c", "pnpm run docker-start && pnpm run workers"]
