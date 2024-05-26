FROM node:16.0-alpine3.13

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm install
COPY --chown=node:node . .
RUN npx vite build
RUN echo "lsssssssssssss"
RUN pwd
RUN ls -al
RUN echo "lsssssssssssss9999"
COPY --chown=node:node dist/. /asset-output/

CMD ["ls", "-al"]
