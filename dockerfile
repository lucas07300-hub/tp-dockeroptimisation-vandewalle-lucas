FROM node:alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
ENV APP_DEBUG=false
ENV NODE_ENV=production
RUN npm run build
USER node
CMD ["node", "server.js"]