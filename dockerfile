# Base image
FROM node:20

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json .

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN pnpm run build


# Specify the command to run the built project
CMD ["node", "app.js"]
