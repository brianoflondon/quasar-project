# GPT-4 prompt:
# give me a Dockerfile for serving a Quasar framework Vue 3 project  Use quasar serve. Do NOT use nginx
# convert that to use Yarn and expose on port 80
# Stage 1: Build the Quasar project
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json, yarn.lock and other necessary files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Quasar app for production
RUN npx quasar build

# Stage 2: Install Quasar CLI and serve the project
FROM node:16

# Set working directory
WORKDIR /app

# Install Quasar CLI globally using Yarn
RUN yarn global add @quasar/cli

# Copy the built project from the previous stage
COPY --from=build /app/dist/spa /app/dist/spa

# Expose the Quasar serve port as 80
EXPOSE 80

# Serve the Quasar project using 'quasar serve' on port 80
CMD ["quasar", "serve", "dist/spa", "--port", "80"]
