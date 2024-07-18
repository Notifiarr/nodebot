FROM node:20-alpine
COPY ./src ./package.json package-lock.json /tsconfig.json /bot/
WORKDIR /bot
RUN npm install && npm run build && npm ci --omit=dev
CMD ["node", "."]
VOLUME [ "/config" ]
