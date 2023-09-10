FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install axios

COPY . .

EXPOSE 8083

CMD ["node", "app.js"]
