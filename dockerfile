# Use a smaller Node.js base image
FROM node:16-slim

# Install necessary packages for Python 3.10.11 installation
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    build-essential \
    zlib1g-dev \
    libssl-dev \
    libffi-dev \
    python3-pip \
    python3-dev && \
    # Install Python 3.10.11
    wget https://www.python.org/ftp/python/3.10.11/Python-3.10.11.tgz && \
    tar -xf Python-3.10.11.tgz && \
    cd Python-3.10.11 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    # Create symlinks for Python and pip
    ln -sf /usr/local/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip3 && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python && \
    # Cleanup
    cd .. && \
    rm -rf Python-3.10.11 Python-3.10.11.tgz && \
    apt-get remove --purge -y build-essential wget && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Upgrade pip to the latest version
RUN pip3 install --no-cache-dir --upgrade pip

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the Python requirements file and install dependencies
COPY ./src/python/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port and run the application
EXPOSE 3000
CMD ["node", "dist/app.js"]
