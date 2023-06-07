FROM nginx:1.25

LABEL maintainer="Morten Rugaard <morten@rugaard.me>" \
      nginx="1.25"

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/vhost.conf /etc/nginx/conf.d/site.conf

# Copy project files into container.
COPY . /var/www/html

# Set working directory.
WORKDIR "/var/www/html"

# Expose port on container.
EXPOSE 3000

# Expose volume to Nginx.
VOLUME ["/var/www/html"]
