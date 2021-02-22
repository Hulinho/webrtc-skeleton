FROM node:14

# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 443
CMD [ "node", "server.js" ]
