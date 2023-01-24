FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY decorate-angular-cli.js .
COPY ./dist/apps/incidence-service .

ENV PORT=3333
EXPOSE 3333

RUN npm install --omit=dev

CMD node ./main.js