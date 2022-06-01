FROM node:17-alpine
LABEL maintainer="AAMServices <info@aamservices.uk>"

RUN npm install @feathersjs/cli -g

RUN mkdir /home/node/.npm && chown -R 1000:1000 "/home/node/.npm"

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "start"]
