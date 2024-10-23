# First stage: Build stage with all dependencies
FROM node:16 as build

# Install dependencies and Python
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    curl \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    libffi-dev \
    liblzma-dev && \
    wget https://www.python.org/ftp/python/3.10.11/Python-3.10.11.tgz && \
    tar -xf Python-3.10.11.tgz && \
    cd Python-3.10.11 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall

# Install Node.js dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Second stage: Run stage with a smaller image
FROM node:16-slim
WORKDIR /usr/src/app

# Copy built app from the first stage
COPY --from=build /usr/src/app .

# Expose the port and run the application
EXPOSE 3000
CMD [ "node", "server.js" ]
