# -----------------------------
# Stage 1: Build React App
# -----------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY visit-tracker-ui/package*.json ./
RUN npm install

# Copy the rest of the source code
COPY visit-tracker-ui/ .

# Build the production-ready app
RUN npm run build

# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional, enables SPA routing)
COPY visit-tracker-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]