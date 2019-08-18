# base image
FROM nginx:1.16.0-alpine

RUN apk add --update nodejs npm bash
RUN npm i -g env-injector@0.0.13

ADD docker_entrypoint.sh /bin/
RUN chmod a+x /bin/docker_entrypoint.sh

EXPOSE 80
CMD ["docker_entrypoint.sh"]
