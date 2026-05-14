#!/bin/sh
set -e

DOMAIN="streaming-platform.ddns.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
    echo "No SSL certificate found. Starting with HTTP-only config..."
    cp /etc/nginx/conf.d/nginx-init.conf /etc/nginx/conf.d/default.conf
    nginx &

    echo "Requesting SSL certificate from Let's Encrypt..."
    certbot certonly --webroot -w /var/www/certbot \
        -d "$DOMAIN" \
        --email "$CERTBOT_EMAIL" \
        --agree-tos --no-eff-email --non-interactive

    echo "Certificate obtained. Switching to full SSL config..."
    cp /etc/nginx/conf.d/nginx-ssl.conf /etc/nginx/conf.d/default.conf
    nginx -s reload
    echo "SSL enabled successfully."

    kill $(cat /var/run/nginx.pid)
fi

cp /etc/nginx/conf.d/nginx-ssl.conf /etc/nginx/conf.d/default.conf

echo "Starting cron for certificate renewal..."
echo "0 12 * * * certbot renew --quiet && nginx -s reload" | crontab -
crond

echo "Starting Nginx..."
exec nginx -g "daemon off;"
