# Use official Node.js LTS image
FROM node:lts

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port your app listens on (update if needed)
EXPOSE 8000

# Start the bot using npm start
CMD ["npm", "start"]
