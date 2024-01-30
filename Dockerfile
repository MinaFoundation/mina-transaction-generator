FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./build ./

CMD ["node", "./src/entry.js"]
