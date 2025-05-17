FROM alpine

RUN apk add --no-cache --update curl ca-certificates tar bash jq \
    && adduser --disabled-password --home /home/container container

USER container
ENV  USER=container HOME=/home/container
    
WORKDIR /home/container
    
COPY ./entrypoint.sh /entrypoint.sh
    
CMD ["/bin/bash", "/entrypoint.sh"]