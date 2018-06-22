FROM node:8-alpine

EXPOSE 4860 4861

COPY . /home/node/app
WORKDIR /home/node/app

RUN apk add --no-cache --virtual .build-deps make gcc g++ python \
 && npm install && cd server/rest && npm install \
 && apk del .build-deps

RUN npm run build

CMD npm start