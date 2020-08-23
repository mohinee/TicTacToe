#!/bin/bash

cd server

composer install

composer dumpautoload -o

cp .env.example .env

php artisan key:generate

php artisan migrate:refresh

php artisan config:clear

php artisan config:cache

