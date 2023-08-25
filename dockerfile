FROM node:20-alpine

WORKDIR /home/node/panchobot

COPY package.json .

COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD ["npm", "run", "start"]
