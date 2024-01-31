FROM node:20-alpine

WORKDIR /home/node/panchobot

COPY package.json .

COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:noenv"]
