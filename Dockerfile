FROM node:17-alpine
LABEL maintainer="AAMServices <info@aamservices.uk>"

RUN mkdir -p /home/node/npm && chown -R node:node /home/node

RUN export npm_config_cache=/home/node/npm

RUN npm install @feathersjs/cli -g

RUN npm cache clean --force 

RUN chown -R node:node /home/node

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "start"]
