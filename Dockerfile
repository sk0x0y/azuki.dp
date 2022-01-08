FROM node:lts-alpine

# LABEL "purpose"="practice"

WORKDIR /app
COPY ./package.json .

COPY . .
RUN chmod +x ./docker-entrypoint.sh

CMD ["sh", "./docker-entrypoint.sh"]
