# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
ENV GEMINI_API_KEY=AIzaSyCkl-KJdSZP8gElGsCvGQZy1F11DcxAZFg 
ENV PORT=4000

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]
