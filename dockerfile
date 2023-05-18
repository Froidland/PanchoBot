# Base image
FROM node:18

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build


# Specify the command to run the built project
CMD ["node", "app.js"]