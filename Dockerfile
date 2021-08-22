# Docker multistage reference:
#   * https://docs.docker.com/develop/develop-images/multistage-build

FROM node:14 AS base

WORKDIR /usr/node/markr

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