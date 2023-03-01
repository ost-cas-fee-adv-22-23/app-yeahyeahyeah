FROM node:16-alpine
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY .npmrc ./
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]