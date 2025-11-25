#!/bin/bash

# base node image
FROM --platform=linux/amd64 node:20-bookworm-slim AS BASE

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Install all node_modules, including dev dependencies
FROM BASE AS deps

WORKDIR /myapp

COPY package.json ./
RUN npm install --production=false --legacy-peer-deps --ignore-scripts && rm -rf /var/lib/apt/lists/*

# Setup production node_modules
FROM BASE AS production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY package.json ./
RUN npm prune --production --legacy-peer-deps

# Build the app
FROM BASE AS build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

COPY prisma prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Clean cache
RUN rm -rf /var/lib/apt/lists/*

# Finally, build the production image with minimal footprint
FROM BASE

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /myapp && \
    chmod +x /myapp/start.sh

USER appuser

ENTRYPOINT [ "./start.sh" ]