FROM nginx:1.25

LABEL maintainer="Morten Rugaard <morten@rugaard.me>" \
      nginx="1.25"

COPY ./.aws/docker/config/nginx.conf /etc/nginx/nginx.conf
COPY ./.aws/docker/config/vhost.conf /etc/nginx/conf.d/default.conf

# Copy project files into container.
COPY ./dist /var/www/html

# Set working directory.
WORKDIR "/var/www/html"

# Expose volume to Nginx.
VOLUME ["/var/www/html"]
