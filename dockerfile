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
    wget https://www.python.org/ftp/python/3.10.11/Python-3.10.11.tgz && \
    tar -xf Python-3.10.11.tgz && \
    cd Python-3.10.11 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip3 && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python && \
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

# Copy Python requirements and install Python dependencies
COPY ./src/python/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy backend package.json and install all dependencies (including devDependencies)
COPY ./src/nodejs/package*.json ./src/nodejs/
RUN cd src/nodejs && npm install  # This installs both dependencies and devDependencies

# Copy Svelte frontend files, including rollup.config.js and all source code
COPY ./src/svelte ./src/svelte
RUN cd src/svelte && npm install

# Build the Svelte frontend
RUN cd src/svelte && npm run build

# Copy all remaining application code
COPY . .

# Expose the application’s port
EXPOSE 3000

# Build the backend (TypeScript compilation)
RUN cd src/nodejs && npm run build

# Start the Node.js application
CMD ["node", "src/nodejs/dist/app.js"]
