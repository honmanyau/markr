# Docker multistage reference:
#   * https://docs.docker.com/develop/develop-images/multistage-build
#
# Installing sqlite3 on Alpine Linux:
#   * https://stackoverflow.com/questions/62554991
#   * https://www.geefire.eu.org/2021/02/20/alpine-nodejs-install-sqlite3.html

FROM node:14.17-alpine AS base

WORKDIR /usr/node/markr

# Updating apk-tools due to docker scan flagging security issues with 2.10.6-r0.
RUN apk add --update --no-cache python g++ make "apk-tools>2.10.7-r0"

COPY package.json .
COPY package-lock.json .

EXPOSE 4567

# =================
# == Development ==
# =================
FROM base AS development

ENV NODE_ENV=development

RUN npm ci
COPY . .

CMD [ "npm", "run", "dev" ]

# ================
# == Production ==
# ================
FROM development AS production

RUN npm run test

ENV NODE_ENV=production

RUN npm run build
RUN npm ci --production

CMD [ "npm", "run", "start" ]