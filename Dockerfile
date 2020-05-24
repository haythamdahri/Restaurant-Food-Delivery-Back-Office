# stage1 - build react app first 
FROM node:14.3.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
RUN npm install --silent
COPY . /app
RUN npm run-script build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.9.15-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]