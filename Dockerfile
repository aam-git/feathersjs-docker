FROM node:alpine
LABEL maintainer="AAMServices <info@aamservices.uk>"

RUN  npm install @feathersjs/cli -g

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN  npm install

EXPOSE 3030

CMD ["npm", "run", "start"]
