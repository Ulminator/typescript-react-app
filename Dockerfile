FROM node
WORKDIR /home/node/app

COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN cd client && npm ci
RUN cd server && npm ci

COPY . .

EXPOSE 8080

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ENV DOCKER=true

CMD if [ $NODE_ENV = development ]; then cd server && npm run dev; else cd server && npm start; fi
