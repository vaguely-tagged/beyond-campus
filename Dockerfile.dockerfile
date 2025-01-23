# Use Ubuntu 16.04 as the base image
FROM ubuntu:16.04

# Set environment variables if needed
ENV NODE_ENV=production

# Update the package manager and install necessary packages
RUN apt-get update -y \
    && apt-get install -y nginx git build-essential g++ curl make python

# Install nodejs(node.js 16)
RUN apt-get update
ENV NODE_VERSION=16.20.2
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version
RUN apt-get clean

# Create the working directory
WORKDIR /usr/src/app/

# Copy package.json and package-lock.json for dependency installation
#COPY package.json package-lock.json ./
# RUN npm install --production --silent
COPY ./ ./

# Install dependencies (production only)
RUN npm install

# Copy the application code into the container

# Install dependencies
RUN npm install -g node-gyp@7.1.2
WORKDIR /usr/src/app/backend/src/lib/
RUN chmod 777 download.sh && ./download.sh

# WORKDIR /usr/src/app

# Create an SQL initialization script
# RUN echo "CREATE TABLE IF NOT EXISTS mytable (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);" > init.sql

# Expose the port your application listens on: 443 (https)
EXPOSE 443

WORKDIR /usr/src/app/backend/src/
RUN chmod +x sessions
CMD node server.js
