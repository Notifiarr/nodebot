FROM node:alpine
COPY ./index.js ./notifiarr.js ./package.json package-lock.json /bot/
WORKDIR /bot
RUN npm install --production
CMD ["node", "index.js"]
