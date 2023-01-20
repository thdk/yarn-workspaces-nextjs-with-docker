# set default values to docker build args that can be used by any build stage
ARG PACKAGE=nextjs-app

# Install dependencies only when needed
FROM node:18-alpine AS packages
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app


# Source: https://stackoverflow.com/a/63142468/681803
# No we need to add only the package.json files of each package
# We do this by copy everything...
COPY packages packages

# ... and then find and remove non-package.json files
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

FROM node:18-alpine as deps
ARG PACKAGE

WORKDIR /app

# Add the yarn version from repo, incl. plugins (eg yarn workspaces) and sdks (if any)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./

# this step breaks the docker cache, it should only copy node_modules from deps
COPY --from=packages /app/packages /app/packages

# only install the dependencies for the target package
RUN yarn workspaces focus $PACKAGE

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
ARG PACKAGE

WORKDIR /app

COPY --from=deps /app .
COPY . .

RUN yarn install

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn workspace $PACKAGE build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
ARG PACKAGE

WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/${PACKAGE}/public ./packages/${PACKAGE}/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/packages/$PACKAGE/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/$PACKAGE/.next/static ./packages/${PACKAGE}/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV PACKAGE_SERVER=packages/${PACKAGE}/server.js

CMD node ${PACKAGE_SERVER}
