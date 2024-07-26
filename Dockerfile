# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables for API keys (replace with your actual keys)
ENV API_APP_KEY=your-tfl-api-key
ENV OPENCAGE_API_KEY=your-opencage-api-key

# Run the tests
CMD ["npm", "run", "cucumber-test"]