FROM node:20-alpine

WORKDIR /app

# This Dockerfile uses pnpm. If you use npm or yarn, update the commands.
RUN npm install -g pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
# This is mainly for initial setup; the volume mount will keep it in sync.
COPY . .

# Expose the Next.js dev server port
EXPOSE 3000

# Run the development server
CMD ["pnpm", "run", "dev"]