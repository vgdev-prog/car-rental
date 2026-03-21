FROM php:8.3-fpm

ARG user=developer
ARG uid=1000

RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-install \
    intl \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN mkdir -p /tmp/sessions && chmod 1777 /tmp/sessions

RUN useradd -G www-data,root -u $uid -d /home/$user $user \
    && mkdir -p /home/$user/.composer \
    && chown -R $user:$user /home/$user

WORKDIR /var/www/app

USER $user
