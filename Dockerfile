FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install \
    apache2 \
    ssl-cert

RUN a2enmod ssl
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod proxy
RUN a2enmod proxy_http

EXPOSE 443

# By default start up apache in the foreground, override with /bin/bash for interative.
CMD /usr/sbin/apache2ctl -D FOREGROUND
    
