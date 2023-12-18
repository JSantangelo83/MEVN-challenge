# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the image
COPY package*.json ./

# Install the application's dependencies inside the Docker image
RUN npm install

# Copy the rest of the application's code into the image
COPY . .

# Compile the TypeScript code
RUN npm run build

# Set the command that will be run when the Docker image is run as a container
CMD [ "node", "dist/index.js" ]