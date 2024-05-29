FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install husky -g
RUN pnpm install
RUN pnpm db:generate

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod --config.ignore-scripts=true

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/sharefolder/ ./sharefolder/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]

EXPOSE 3000