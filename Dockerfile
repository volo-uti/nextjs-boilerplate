# syntax=docker/dockerfile:1
# Stages: base (dependencies) -> check (the gate) -> build (gate passed, build output in place).
# `pnpm verify` builds the `check` stage; the deploy workflow builds `build`.
ARG NODE_VERSION=lts

FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV CI=true
# Install the pnpm version pinned by "packageManager" (corepack is not used).
COPY package.json ./
RUN npm install --global "pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]")"
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS check
RUN pnpm check

# `pnpm check` already ran the production build of every app.
# Product-specific packaging (for example `output: "standalone"`) is added here.
FROM check AS build
