# FROM nginx:alpine
# COPY ./dist /usr/share/nginx/html
# COPY ./config/nginx-custom.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80 443
# CMD ["nginx", "-g", "daemon off;"]

FROM node:14-alpine as build-stage
WORKDIR /usr/src/app
RUN npm i -g @angular/cli@14.0.0 
COPY package.json package.json
RUN npm install
COPY . .
RUN ng build --configuration=production --build-optimizer

FROM nginx:alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY ./config/nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]