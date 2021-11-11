FROM node:16.13.0-alpine3.14 AS build
WORKDIR /app
COPY package* package-lock.json ./
RUN apk add git && npm install
COPY . .
CMD ["npm", "start"]
#RUN sh -c "tail -F anything"
#RUN yarn run build
#RUN npm start
#CMD ["node", "src/index.js"]

#FROM nginx:alpine
#COPY --from=build /app/build /usr/share/nginx/html
