FROM node:17-bullseye-slim
LABEL maintainer="AAMServices <info@aamservices.uk>"

USER root

RUN npm install @feathersjs/cli -g

WORKDIR /home/node/.npm

RUN chown -R 1000:1000 /home/node

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "start"]
