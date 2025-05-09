# Use the desired Node.js version
FROM node:18.12.1 AS base

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci
# Copy app files
COPY . .

# Build the TypeScript code
RUN npm run build


#Run the app
FROM node:18.12.1-alpine
WORKDIR /app
COPY --from=base /app/dist/ /app/dist/
COPY --from=base /app/node_modules/ /app/node_modules/
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/server/files /app/dist/files

EXPOSE 8080
# Run the compiled JavaScript application
CMD ["node", "dist/index.js"]
