FROM node:21.4.0 as build

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package.json /app/package.json

# Copy the entire project to the working directory
COPY . /app

RUN npm install
RUN npm run build

# Serve Application using Nginx Server
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
