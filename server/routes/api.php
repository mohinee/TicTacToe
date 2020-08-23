<?php

use App\Http\Middleware\AddUserToGame;
use App\Http\Middleware\EndGame;
use App\Http\Middleware\FindWinner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::post('/user', 'User@create');
Route::put('/user/{id}', 'User@update');
Route::get('/user/{id}', 'User@get');

Route::post('/game', 'Game@create')->middleware(AddUserToGame::class);
Route::put('/game/start/{game_id}', 'Game@update')->middleware(AddUserToGame::class);
Route::put('/game/moves', 'GameHistory@create');
Route::get('/game/{id}', 'Game@get');
Route::get('/game/active/list', 'Game@getAllCreatedGames');


Route::get('/game/history/allmoves/{game_id}', 'GameHistory@getAllMoves');
