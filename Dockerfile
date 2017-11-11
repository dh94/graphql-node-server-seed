FROM mhart/alpine-node:6.5

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
EXPOSE 5000
RUN ["npm", "run", "build"]
CMD [ "node", "./dist/index.js" ]