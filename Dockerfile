FROM node:16-alpine
ARG NPM_TOKEN
WORKDIR /usr/src/app
RUN npm install --global pm2
COPY .npmrc ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
COPY package*.json ./
RUN npm install --omit=dev
COPY ./ ./
RUN npm run build
EXPOSE 3000
USER node
CMD [ "pm2-runtime", "npm", "--", "start" ]