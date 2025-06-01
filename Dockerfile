FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4001

RUN yarn build

CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start:prod"]


