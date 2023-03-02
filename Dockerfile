FROM node:16-alpine
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY .npmrc ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
COPY package*.json ./
RUN npm install && npm install --global pm2
COPY ./ ./
RUN npm run build --omit=dev
EXPOSE 3000
USER node
CMD [ "pm2-runtime", "npm", "--", "start" ]