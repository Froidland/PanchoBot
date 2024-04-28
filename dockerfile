FROM node:22-alpine

WORKDIR /home/node/panchobot

COPY package.json .

COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["npm", "run", "start:noenv"]
