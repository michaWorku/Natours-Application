FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run build:js

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
