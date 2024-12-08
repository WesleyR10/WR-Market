FROM node:20 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY .npmrc ./

COPY apps/api ./apps/api
COPY packages/ ./packages/
COPY config/ ./config/

RUN yarn install --frozen-lockfile
ENV PATH /usr/src/app/node_modules/.bin:$PATH

WORKDIR /usr/src/app/apps/api

RUN yarn build

FROM node:20-alpine3.20


COPY --from=build /usr/src/app/apps/api/dist ./dist
COPY --from=build /usr/src/app/apps/api/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

CMD ["yarn", "start"]