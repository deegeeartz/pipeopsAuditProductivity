# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /backend

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

RUN npx prisma generate

# Installing pm2 globally
RUN npm install pm2 -g

# Starting our application
CMD pm2 start process.yml && tail -f /dev/null

# Exposing server port
EXPOSE 4802