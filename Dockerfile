FROM node:alpine
COPY ./index.js ./notifiarr.js ./functions.js ./package.json package-lock.json /bot/
WORKDIR /bot
RUN npm install --production
CMD ["node", "index.js"]
