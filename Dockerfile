FROM node:16-alpine
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY .npmrc ./
COPY package*.json ./
RUN npm install
COPY . ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]