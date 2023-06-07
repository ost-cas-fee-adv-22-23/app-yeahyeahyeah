# Local build on a mac (arm with M1 chip)
# FROM node:16-alpine as base
# Local build for linux (amd64) architecture
# FROM node:16-alpine --platform=linux/amd64 as base
FROM node:16-alpine as base
ARG NPM_TOKEN
WORKDIR /app
COPY package*.json ./
RUN npm config set //npm.pkg.github.com/:_authToken $NPM_TOKEN

FROM base as build
RUN npm ci
COPY . .
RUN npm run build

FROM base as production
ENV NODE_ENV=production
RUN npm ci --ignore-scripts

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/withTwin.js ./withTwin.js

EXPOSE 3000
USER node
CMD [ "npm", "--", "start" ]
