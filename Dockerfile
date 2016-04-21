FROM node:5.1.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g nodemon
COPY . /usr/src/app

ENV NODE_ENV production

expose 8000
CMD [ "npm", "start" ]
