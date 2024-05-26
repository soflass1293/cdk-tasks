FROM node:16.0-alpine3.13

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm install
COPY --chown=node:node . .

CMD [ "npx", "vite", "build" ]