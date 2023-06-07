FROM node:latest

WORKDIR /usr/local/mihoyo/docker

COPY package*.json ./

RUN npm install yarn --registry=https://registry.npm.taobao.org

RUN yarn --registry=https://registry.npm.taobao.org

COPY . .

EXPOSE 8081
CMD [ "yarn", "start" ]
