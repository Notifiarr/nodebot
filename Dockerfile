FROM node:alpine
COPY ./index.js ./notifiarr.js ./package.json package-lock.json /bot/
RUN cd /bot && npm install --production
CMD ["node", "/bot/index.js"]
