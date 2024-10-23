# First stage: Build stage with all dependencies
FROM node:16 as build

# Install dependencies and Python
RUN apt-get update && \
    echo "Installing system dependencies..." && \
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
    python3-pip && \  # Install pip
    echo "Downloading Python..." && \
    wget https://www.python.org/ftp/python/3.10.11/Python-3.10.11.tgz && \
    echo "Extracting Python..." && \
    tar -xf Python-3.10.11.tgz && \
    cd Python-3.10.11 && \
    echo "Configuring Python..." && \
    ./configure --enable-optimizations && \
    echo "Building Python..." && \
    make -j$(nproc) && \
    echo "Installing Python..." && \
    make altinstall && \
    echo "Python installation complete."

# Install Node.js dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN echo "Installing Node.js dependencies..." && \
    npm install && \
    echo "Node.js dependencies installed."

# Install Python dependencies
COPY requirements.txt ./
RUN echo "Installing Python dependencies..." && \
    pip3 install --no-cache-dir -r requirements.txt && \
    echo "Python dependencies installed."

# Second stage: Run stage with a smaller image
FROM node:16-slim
WORKDIR /usr/src/app

# Copy built app from the first stage
COPY --from=build /usr/src/app ./ 

# Debug: List contents of the application directory
RUN echo "Listing contents of /usr/src/app:" && \
    ls -al /usr/src/app && \
    echo "Contents listed."

# Expose the port and run the application
EXPOSE 3000
CMD ["node", "server.js"]
