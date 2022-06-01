FROM node:17-alpine
LABEL maintainer="AAMServices <info@aamservices.uk>"

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN  npm install @feathersjs/cli && npm install

EXPOSE 3030

CMD ["npm", "run", "start"]
