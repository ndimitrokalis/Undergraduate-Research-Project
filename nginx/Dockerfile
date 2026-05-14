FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache certbot openssl dcron

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx-ssl.conf
COPY nginx/nginx-init.conf /etc/nginx/nginx-init.conf
COPY nginx/entrypoint.sh /entrypoint.sh

RUN rm -f /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/www/certbot

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
