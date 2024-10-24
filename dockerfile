# Build stage with all dependencies
FROM node:16 AS build

# Install dependencies and Python
RUN apt-get update && \
    apt-get install -y \
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
    liblzma-dev \
    python3-pip \
    python3-dev && \
    wget https://www.python.org/ftp/python/3.10.11/Python-3.10.11.tgz && \
    tar -xf Python-3.10.11.tgz && \
    cd Python-3.10.11 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip3 && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python

# Upgrade pip to the latest version
RUN pip3 install --upgrade pip

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the Python requirements file and install dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application files (including server.js)
COPY . .

# List contents of the application directory (for debugging)
RUN ls -al /usr/src/app

# Expose the port and run the application
EXPOSE 3000
CMD ["node", "server.js"]
