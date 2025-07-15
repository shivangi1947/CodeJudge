FROM node:20.10.0-alpine

WORKDIR /app

# Install compilers and tools needed for native modules
RUN apk update && apk add --no-cache g++ make python3

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 8000
CMD ["node", "index.js"]
