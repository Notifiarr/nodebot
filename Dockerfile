FROM node:alpine
COPY ./src ./package.json package-lock.json /bot/
WORKDIR /bot
RUN npm install --production
CMD ["npm", "run", "start"]
