FROM node:16-alpine

WORKDIR /app
COPY package.json .
RUN npm cache verify
RUN npm install --only=prod
COPY . .

CMD ["npm", "run", "dev"]