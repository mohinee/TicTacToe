### SERVER SETUP:

if you do not have composer installed on your machine please install it using https://getcomposer.org/download/
&&

`mv composer.phar /usr/local/bin/composer`

run setup.sh in your terminal or run following commands ;
`cd server`

`composer install`

`composer dumpautoload -o`

`cp .env.example .env`

`php artisan key:generate`

Edit the .env file to suit your needs (APP*\*, DB*\*, …). give local Mysql db access and create a fresh empty db to be used by this app.

`php artisan migrate:refresh` : will set up the db tables

`php artisan config:clear`

`php artisan config:cache`
`php artisan serve` : will start the php server on port 8000

API documentation :https://documenter.getpostman.com/view/12139085/T1LV9j7M?version=latest

### UI SETUP:

`cd ui`
`yarn install`
`yarn start` : will start the react server on port 3000
