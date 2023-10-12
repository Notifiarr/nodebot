FROM node:alpine
COPY ./src ./package.json package-lock.json /tsconfig.json /bot/
WORKDIR /bot
RUN npm install
CMD ["npm", "run", "start"]
