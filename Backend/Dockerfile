FROM node

ENV NODE_ENV=production

WORKDIR /app

RUN npm install --production

COPY . .

CMD ["node", "./src/app.js"]