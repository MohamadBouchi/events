#stage 1

FROM node:10.14.2 AS dev-app
WORKDIR /usr/src/app
COPY ./ /usr/src/app
RUN npm install

#stage 2
FROM node:10.14.2 as build-app
WORKDIR /usr/src/app
COPY --from=dev-app /usr/src/app /usr/src/app
RUN npm run-script build

#stage 3
FROM nginx
COPY --from=build-app /usr/src/app/build/ /usr/share/nginx/html/
EXPOSE 80
