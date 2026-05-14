#!/bin/sh

DOMAIN="streaming-platform.ddns.net"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# Remove all configs to start clean — nginx loads every .conf in conf.d/
rm -f /etc/nginx/conf.d/*.conf

if [ ! -f "$CERT_PATH" ]; then
    echo "No SSL certificate found. Starting with HTTP-only config..."
    cp /etc/nginx/nginx-init.conf /etc/nginx/conf.d/default.conf
    nginx &
    sleep 2

    echo "Requesting SSL certificate from Let's Encrypt..."
    if certbot certonly --webroot -w /var/www/certbot \
        -d "$DOMAIN" \
        --email "$CERTBOT_EMAIL" \
        --agree-tos --no-eff-email --non-interactive; then
        echo "Certificate obtained."
    else
        echo "Certbot failed. Running in HTTP-only mode."
        echo "Run 'docker exec streaming-nginx certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --email \$CERTBOT_EMAIL --agree-tos --no-eff-email --non-interactive' to retry manually."
        wait
        exit 0
    fi

    nginx -s stop
    sleep 1
fi

echo "Starting with full SSL config..."
rm -f /etc/nginx/conf.d/*.conf
cp /etc/nginx/nginx-ssl.conf /etc/nginx/conf.d/default.conf

echo "Starting cron for certificate renewal..."
echo "0 12 * * * certbot renew --quiet && nginx -s reload" | crontab -
crond

echo "Starting Nginx..."
exec nginx -g "daemon off;"
