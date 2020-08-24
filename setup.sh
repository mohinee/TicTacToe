#!/bin/bash

cd server

composer install

composer dumpautoload -o

cp .env.example .env

php artisan key:generate


